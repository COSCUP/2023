import _rawData from '@/../public/json/session.json'
import { formatDateString, getYearMonthDate, fixedTimeZoneDate, generateAgendaTableData, SessionBase, generateAgendaListData, AgendaTableData, AgendaListData } from './utils'
import { uniqBy, groupBy } from 'lodash-es'

export * from './utils'

type RawData = typeof _rawData
type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];
type SessionData = ArrayElement<typeof _rawData.sessions>
type TypeData = ArrayElement<typeof _rawData['session_types']>
type SpeakerData = ArrayElement<typeof _rawData.speakers>
type RoomData = ArrayElement<typeof _rawData.rooms>
type TagData = ArrayElement<typeof _rawData.tags>
export type Room = RoomData

const rawData: RawData = Object.freeze(_rawData)

export interface Session extends SessionBase, Omit<SessionData, 'type' | 'room' | 'speakers' | 'tags' | 'start' | 'end'> {
  start: Date;
  end: Date;
  type: TypeData;
  roomId: string;
  room: RoomData;
  speakers: SpeakerData[];
  tags: TagData[];
}

export interface DayData {
  day: [number, number, number];
  table: AgendaTableData;
  list: AgendaListData;
}

export interface AgendaService {
  dayIndex: number;
  readonly day: [number, number, number];
  readonly table: AgendaTableData;
  readonly list: AgendaListData;
  getSessionById: (sessionId: string) => Readonly<Session> | null;
  getRoomById: (roomId: string) => Readonly<Room> | null;
}

class AgendaServiceConcrete implements AgendaService {
  // the minutes of time zone offset for zh-TW
  private readonly _timeZoneOffsetMinutes = -480
  private _roomSequence: string[] | undefined
  private _rooms: Room[] = rawData.rooms
  private _dayIndex = 0
  private _days: DayData[]

  constructor (roomSequence?: string[]) {
    this._roomSequence = roomSequence
    const grouped = groupBy(this._sessions, (session) => formatDateString(session.start))
    this._days = Object.entries<Session[]>(grouped)
      .sort((entryA, entryB) => parseInt(entryA[0]) - parseInt(entryB[0]))
      .map((entry) => ({
        day: getYearMonthDate(entry[1][0].start),
        table: generateAgendaTableData(entry[1], this._roomSequence),
        list: generateAgendaListData(entry[1], this._roomSequence)
      }))
  }

  private get _sessions (): Session[] {
    return uniqBy(rawData.sessions.map((sessionData: SessionData) => {
      const type: TypeData | undefined = rawData.session_types.find((typeData: TypeData) => typeData.id === sessionData.type)
      if (type === undefined) throw new Error()

      const room: RoomData | undefined = rawData.rooms.find((roomData: RoomData) => roomData.id === sessionData.room)
      if (room === undefined) throw new Error()

      const speakers: SpeakerData[] = rawData.speakers.filter((speakerData: SpeakerData) => sessionData.speakers.includes(speakerData.id))
      if (speakers.length === 0) throw new Error()

      const tags: TagData[] = rawData.tags.filter((tagData: TagData) => sessionData.tags.includes(tagData.id))
      // if (tags.length === 0) throw new Error()

      const start: Date = fixedTimeZoneDate(new Date(sessionData.start), this._timeZoneOffsetMinutes)
      if (start.toString() === 'Invalid Date') throw new Error()

      const end: Date = fixedTimeZoneDate(new Date(sessionData.end), this._timeZoneOffsetMinutes)
      if (end.toString() === 'Invalid Date') throw new Error()

      return {
        ...sessionData,
        start,
        end,
        type,
        roomId: sessionData.room,
        room,
        speakers,
        tags
      }
    }), (session) => session.id)
  }

  private get _sessionSet (): { [id: string]: Session } {
    return Object.fromEntries(
      this._sessions.map((session: Session) => [session.id, session])
    )
  }

  private get _roomSet (): { [id: string]: Room } {
    return Object.fromEntries(
      this._rooms.map((room: Room) => [room.id, room])
    )
  }

  public get dayIndex (): number {
    return this._dayIndex
  }

  public set dayIndex (value: number) {
    this._dayIndex = value
  }

  public get day (): [number, number, number] {
    return this._days[this.dayIndex].day
  }

  public get table (): AgendaTableData {
    return this._days[this.dayIndex].table
  }

  public get list (): AgendaListData {
    return this._days[this.dayIndex].list
  }

  public getSessionById (sessionId: string): Readonly<Session> | null {
    const session = this._sessionSet[sessionId]
    if (!session) return null
    return Object.freeze(session)
  }

  public getRoomById (roomId: string): Readonly<Room> | null {
    const room = this._roomSet[roomId]
    if (!room) return null
    return Object.freeze(room)
  }
}

export function createAgendaService (roomSequence?: string[]): AgendaService {
  return new AgendaServiceConcrete(roomSequence)
}
