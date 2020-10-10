// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { EventEmitter, Listener } from 'events'
import { groupBy } from 'lodash'
import { formatDateString, fixedTimeZoneDate, generateAgendaTableData, generateAgendaListData, generateSessionPopupData, generateSession } from './utils'
import { AgendaListData, AgendaTableData, Day, RawData, RoomData, Session, SessionData } from './types'
import { PopupData } from '@/services/popup'
import { immediatePromise } from '@/utils/common'

export * from './types'
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
  getDays: () => Day[];
  getDayData: (dayIndex: number) => DayData;
  getSessionById: (sessionId: string) => Readonly<Session> | null;
  getRoomById: (roomId: string) => Readonly<Room> | null;
  getSessionPopupData: (sessionId: string, language: 'en' | 'zh') => Promise<PopupData>;
  getRoomsInProgressSession: () => RoomSession[];
  init: () => Promise<void>;
  onUpdated: (listener: Listener) => void;
}

class AgendaServiceConcrete implements AgendaService {
  // the minutes of time zone offset for zh-TW
  private readonly _timeZoneOffsetMinutes = -480
  private _emitter = new EventEmitter()
  private _isInitialized = false
  private _rawData: RawData | null = null
  private _roomSequence: string[] | undefined
  private _roomSet: { [roomId: string]: Room} = {}
  private _days: Day[] = []
  private _sessionDataListByDays: SessionData[][] = []
  private _dayDataCache: { [dateString: string]: DayData } = {}
  private _sessionsCache: { [sessionId: string]: Session } = {}

  constructor (roomSequence?: string[]) {
    this._roomSequence = roomSequence
  }

  public async init () {
    if (this._isInitialized || this._rawData !== null) return
    await immediatePromise()
    this._rawData = await import('@/../public/json/session.json')
    this._initRooms()
    this._initDays()
    this._isInitialized = true
    this._emitter.emit('update')
  }

  private _initDays () {
    const rawData = this._rawData
    if (rawData === null) throw new Error('this._rawData is null')

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

    this._days.map((day) => day.join(''))
      .forEach((day, dayIndex) => {
        if (!this._dayDataCache[day]) {
          this._dayDataCache[day] = this._generateDayData(rawData, dayIndex)
        }
      })
  }

  private _initRooms (): void {
    if (this._rawData === null) throw new Error('this._rawData is null')

    this._rawData.rooms.forEach((room: Room) => {
      this._roomSet[room.id] = room
    })
  }

  private _generateDayData (rawData: RawData, dayIndex: number): DayData {
    const day = this._days[dayIndex]
    const sessionDataList = this._sessionDataListByDays[dayIndex]

    sessionDataList.forEach((sessionData) => {
      if (this._sessionsCache[sessionData.id]) return
      this._sessionsCache[sessionData.id] = this._generateSession(rawData, sessionData)
    })

    return {
      day,
      table: generateAgendaTableData(sessionDataList, this._fixedTimeZone, this._roomSequence),
      list: generateAgendaListData(sessionDataList, this._fixedTimeZone, this._roomSequence)
    }
  }

  private _generateSession (rawData: RawData, sessionData: SessionData): Session {
    return generateSession(rawData, sessionData, this._fixedTimeZone)
  }

  private get _fixedTimeZone (): ((date: Date | string) => Date) {
    return (date: Date | string) => fixedTimeZoneDate(date, this._timeZoneOffsetMinutes)
  }

  public onUpdated (listener: Listener) {
    this._emitter.on('update', listener)
  }

  public getDays (): Day[] {
    return [...this._days]
  }

  public getDayData (dayIndex: number): DayData {
    if (this._rawData === null) throw new Error('AgendaService is not initialized')
    if (dayIndex < 0 || dayIndex > this._days.length) throw new Error(`Invalid dayIndex ${dayIndex}`)
    const day = this._days[dayIndex].join('')
    if (!this._dayDataCache[day]) {
      this._dayDataCache[day] = this._generateDayData(this._rawData, dayIndex)
    }
    return this._dayDataCache[day]
  }

  public getSessionById (sessionId: string): Readonly<Session> {
    if (this._rawData === null) throw new Error('AgendaService is not initialized')
    const cache = this._sessionsCache[sessionId]
    if (cache) return cache
    const sessionData = this._rawData.sessions.find((sessionData) => sessionData.id === sessionId)
    if (!sessionData) throw new Error(`Invalid sessionId: ${sessionId}`)
    this._sessionsCache[sessionId] = this._generateSession(this._rawData, sessionData)
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
    if (!this._isInitialized || this._rawData === null) throw new Error('AgendaService is not initialized')
    const currentMoment = this._fixedTimeZone(new Date())
    const roomSessionMap: { [roomId: string]: Session } = Object.fromEntries(this._rawData.sessions
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
