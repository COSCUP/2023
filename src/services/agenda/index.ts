// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { groupBy } from 'lodash'
import { Day, formatDateString, fixedTimeZoneDate, generateAgendaTableData, generateAgendaListData, AgendaTableData, AgendaListData, RoomData, Session, SessionData, rawData, generateSessionPopupData, generateSession } from './utils'
import { PopupData } from '@/services/popup'

export * from './utils'

export type Room = RoomData
export interface DayData {
  day: Day;
  table: AgendaTableData;
  list: AgendaListData;
}

export interface RoomSession {
  room: Room;
  session: Session | null;
}

export interface AgendaService {
  readonly sessionSet: { [sessionId: string]: Session };
  readonly days: Day[];
  getDayData: (dayIndex: number) => DayData;
  getSessionById: (sessionId: string) => Readonly<Session> | null;
  getRoomById: (roomId: string) => Readonly<Room> | null;
  getSessionPopupData: (sessionId: string, language: 'en' | 'zh') => Promise<PopupData>;
  getRoomsInProgressSession: () => RoomSession[];
}

class AgendaServiceConcrete implements AgendaService {
  // the minutes of time zone offset for zh-TW
  private readonly _timeZoneOffsetMinutes = -480
  private _roomSequence: string[] | undefined
  private _roomSet: { [roomId: string]: Room} = {}
  private _days: Day[] = []
  private _sessionDataListByDays: SessionData[][] = []
  private _dayDataCache: { [dateString: string]: DayData } = {}
  private _sessionsCache: { [sessionId: string]: Session } = {}

  constructor (roomSequence?: string[]) {
    this._roomSequence = roomSequence
    this._initRooms()
    this._initDays()
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
        ] as [Day, SessionData[]]
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

  public get days (): Day[] {
    return this._days
  }

  public get sessionSet () {
    return this._sessionsCache
  }

  public getDayData (dayIndex: number): DayData {
    if (dayIndex < 0 || dayIndex > this._days.length) throw new Error(`Invalid dayIndex ${dayIndex}`)
    const day = this._days[dayIndex].join('')
    if (!this._dayDataCache[day]) {
      this._dayDataCache[day] = this._generateDayData(dayIndex)
    }
    return this._dayDataCache[day]
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

  public getRoomsInProgressSession (): RoomSession[] {
    const currentMoment = this._fixedTimeZone(new Date())
    const roomSessionMap: { [roomId: string]: Session } = Object.fromEntries(rawData.sessions
      .filter((sessionData) => {
        const start = this._fixedTimeZone(sessionData.start)
        const end = this._fixedTimeZone(sessionData.end)
        return start.getTime() <= currentMoment.getTime() && currentMoment.getTime() <= end.getTime()
      })
      .map((sessionData) => {
        const session = this.getSessionById(sessionData.id)
        return [session.room.id, session]
      })
    )

    return (this._roomSequence || Object.keys(this._roomSet))
      .map((roomId) => {
        return {
          room: this.getRoomById(roomId),
          session: roomSessionMap[roomId] || null
        }
      })
  }
}

export function createAgendaService (roomSequence?: string[]): AgendaService {
  return new AgendaServiceConcrete(roomSequence)
}
