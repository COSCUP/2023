// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { groupBy } from 'lodash'
import { formatDateString, fixedTimeZoneDate, generateAgendaTableData, generateAgendaListData, AgendaTableData, AgendaListData, RoomData, Session, SessionData, rawData, generateSessionPopupData, generateSession } from './utils'
import { PopupData } from '@/services/popup'
import { useService } from '@/utils/common'

export * from './utils'

export type Room = RoomData

export interface DayData {
  day: [number, number, number];
  table: AgendaTableData;
  list: AgendaListData;
}

export interface AgendaService {
  dayIndex: number;
  readonly sessionSet: { [sessionId: string]: Session };
  readonly days: [number, number, number][];
  readonly day: [number, number, number];
  readonly table: AgendaTableData;
  readonly list: AgendaListData;
  getSessionById: (sessionId: string) => Readonly<Session> | null;
  getRoomById: (roomId: string) => Readonly<Room> | null;
  getSessionPopupData: (sessionId: string, language: 'en' | 'zh') => Promise<PopupData>;
}

class AgendaServiceConcrete implements AgendaService {
  // the minutes of time zone offset for zh-TW
  private readonly _timeZoneOffsetMinutes = -480
  private _roomSequence: string[] | undefined
  private _roomSet: { [roomId: string]: Room} = {}
  private _dayIndex = 0
  private _days: [number, number, number][] = []
  private _sessionDataListByDays: SessionData[][] = []
  private _dayDataCache: { [dateString: string]: DayData } = {}
  private _sessionsCache: { [sessionId: string]: Session } = {}

  constructor (roomSequence?: string[]) {
    this._roomSequence = roomSequence
    this._initRooms()
    this._initDays()
    this.dayIndex = 0
  }

  private _initDays (): void {
    Object.entries(
      groupBy(
        rawData.sessions,
        (sessionData) => formatDateString(
          fixedTimeZoneDate(
            new Date(sessionData.start),
            this._timeZoneOffsetMinutes
          ),
          ','
        )
      )
    )
      .sort((entryA, entryB) => parseInt(entryA[0].replace(/,/g, '')) - parseInt(entryB[0].replace(/,/g, '')))
      .map((entry) => {
        return [
          entry[0].split(',').map((numStr) => parseInt(numStr)),
          entry[1]
        ] as [[number, number, number], SessionData[]]
      })
      .forEach(([day, sessionDataList]) => {
        this._days.push(day)
        this._sessionDataListByDays.push(sessionDataList)
      })
  }

  private _initRooms (): void {
    rawData.rooms.forEach((room: Room) => {
      this._roomSet[room.id] = room
    })
  }

  private _generateDayData (dayIndex: number): DayData {
    const day = this._days[dayIndex]
    const sessionDataList = this._sessionDataListByDays[dayIndex]

    sessionDataList.forEach((sessionData) => {
      if (this._sessionsCache[sessionData.id]) return
      this._sessionsCache[sessionData.id] = this._generateSession(sessionData)
    })

    return {
      day,
      table: generateAgendaTableData(sessionDataList, this._fixedTimeZone, this._roomSequence),
      list: generateAgendaListData(sessionDataList, this._fixedTimeZone, this._roomSequence)
    }
  }

  private _generateSession (sessionData: SessionData): Session {
    return generateSession(sessionData, this._fixedTimeZone)
  }

  private get _fixedTimeZone (): ((date: Date | string) => Date) {
    return (date: Date | string) => fixedTimeZoneDate(date, this._timeZoneOffsetMinutes)
  }

  public get dayIndex (): number {
    return this._dayIndex
  }

  public set dayIndex (value: number) {
    if (value < 0 || value > this._days.length) throw new Error(`Invalid dayIndex ${value}`)
    if (!this._dayDataCache[value]) {
      this._dayDataCache[this._days[value].join('')] = this._generateDayData(value)
    }
    this._dayIndex = value
  }

  public get days (): [number, number, number][] {
    return this._days
  }

  public get day (): [number, number, number] {
    return this._days[this.dayIndex]
  }

  public get table (): AgendaTableData {
    return this._dayDataCache[`${this._days[this.dayIndex].join('')}`].table
  }

  public get list (): AgendaListData {
    return this._dayDataCache[`${this._days[this.dayIndex].join('')}`].list
  }

  public get sessionSet () {
    return this._sessionsCache
  }

  public getSessionById (sessionId: string): Readonly<Session> {
    const cache = this._sessionsCache[sessionId]
    if (cache) return cache
    const sessionData = rawData.sessions.find((sessionData) => sessionData.id === sessionId)
    if (!sessionData) throw new Error(`Invalid sessionId: ${sessionId}`)
    this._sessionsCache[sessionId] = this._generateSession(sessionData)
    return this._sessionsCache[sessionId]
  }

  public getRoomById (roomId: string): Readonly<{ id: string; zh: { name: string }; en: { name: string } }> {
    const room = this._roomSet[roomId]
    if (!room) throw new Error(`Invalid roomId ${roomId}`)
    return room
  }

  public async getSessionPopupData (sessionId: string, language: 'en' | 'zh'): Promise<PopupData> {
    const session = this.getSessionById(sessionId)
    return await generateSessionPopupData(session, language)
  }
}

export function createAgendaService (roomSequence?: string[]): AgendaService {
  return new AgendaServiceConcrete(roomSequence)
}

export function useAgendaService (): AgendaService {
  return useService<AgendaService>('agendaService')
}
