import { groupBy } from 'lodash-es'

export interface SessionBase {
  id: string;
  start: Date;
  end: Date;
  roomId: string;
}

export enum TableCellType {
  Blank = 'Blank',
  Span = 'Span',
  Session = 'Session'
}

export interface TableCellBlank {
  type: TableCellType.Blank;
  rowSpan: 1;
}

export interface TableCellSpan {
  type: TableCellType.Span;
}

export interface TableCellSession {
  type: TableCellType.Session;
  sessionId: string;
  rowSpan: number;
}

export type TableCell = TableCellBlank | TableCellSpan | TableCellSession

export interface AgendaTableData {
  rooms: string[];
  rows: TableCell[][];
}

export interface AgendaListData {
  sections: {
    start: Date;
    sessions: string[];
  }[];
}

/**
 * Return a time zone fixed Date object.
 *
 * @param {Date} date Source Date object
 * @param {number} timeZoneOffsetMinutes The time zone difference, in minutes, from current locale (host system settings) to UTC.
 * @returns {Date} Time zone fixed Date object
 */
export function fixedTimeZoneDate (date: Date, timeZoneOffsetMinutes: number): Date {
  date = new Date(date)
  date.setMinutes(date.getMinutes() - timeZoneOffsetMinutes + (date.getTimezoneOffset()))
  return date
}

/**
 * Retrieve tuple of [year, month, day] from a date object.
 *
 * @param {Date} dateObj Source Date object
 * @returns {[number, number, number]} Tuple of [year, month, day]. For example, the Date of '2020/6/21' would get [2020, 6, 21].
 */
export function getYearMonthDate (dateObj: Date): [number, number, number] {
  return [dateObj.getFullYear(), dateObj.getMonth() + 1, dateObj.getDate()]
}

/**
 * Retrieve tuple of [hours, minutes] from a date object.
 *
 * @param {Date} dateObj Source Date object
 * @returns {[number, number]} Tuple of [hours, minutes]. For example, the Date of '18:30' would get [18, 30].
 */
export function getHoursMinutes (dateObj: Date): [number, number] {
  return [dateObj.getHours(), dateObj.getMinutes()]
}

export function formatDateString (date: Date, joinChar = '') {
  return getYearMonthDate(date)
    .map((digit) => digit.toString().padStart(2, '0')).join(joinChar)
}

export function formatTimeString (date: Date, joinChar = '') {
  return getHoursMinutes(date)
    .map((digit) => digit.toString().padStart(2, '0')).join(joinChar)
}

export function getTimePoints (sessions: SessionBase[]) {
  return [...new Set([
    ...sessions.flatMap((session) => {
      return [formatTimeString(session.start), formatTimeString(session.end)]
    })
  ])]
    .sort((strA, strB) => parseInt(strA) - parseInt(strB))
    .map((timeStr) => `t-${timeStr}`)
}

export function generateAgendaTableData (sessions: SessionBase[], roomSequence?: string[]): AgendaTableData {
  const timePoints = getTimePoints(sessions)
  let entries = Object.entries(groupBy(sessions, (session) => `r-${session.roomId}`))
  if (roomSequence) {
    entries = entries.sort((entryA, entryB) => {
      const indexA = roomSequence.indexOf(entryA[0].slice(2))
      const indexB = roomSequence.indexOf(entryB[0].slice(2))
      if (indexA === -1 || indexB === -1) throw new Error()

      return indexA - indexB
    })
  }
  const blankCell: TableCell = { type: TableCellType.Blank, rowSpan: 1 }
  const spanCell: TableCell = { type: TableCellType.Span }
  const rooms = entries.map((entry) => entry[0].slice(2))
  let rows = new Array<() => TableCell[]>(timePoints.length)
    .fill((): TableCell[] => new Array<TableCell>(rooms.length).fill(blankCell))
    .map((a) => a())
  entries.forEach((entry, columnIndex) => {
    entry[1]
      .sort((sessionA, sessionB) => {
        const indexA = timePoints.indexOf(`t-${formatTimeString(sessionA.start)}`)
        const indexB = timePoints.indexOf(`t-${formatTimeString(sessionB.start)}`)
        if (indexA === -1 || indexB === -1) throw new Error(`${indexA}, ${indexB}`)

        return indexA - indexB
      })
      .forEach((session) => {
        const indexStart = timePoints.indexOf(`t-${formatTimeString(session.start)}`)
        const indexEnd = timePoints.indexOf(`t-${formatTimeString(session.end)}`)
        if (indexStart === -1 || indexEnd === -1 || indexStart >= indexEnd) throw new Error()

        const rowSpan = indexEnd - indexStart

        rows[indexStart][columnIndex] = { type: TableCellType.Session, sessionId: session.id, rowSpan }
        for (let i = 1; i < rowSpan; i++) {
          rows[indexStart + i][columnIndex] = spanCell
        }
      })
  })

  const columns = rows[0].map((col, colIndex) => rows.map((row) => row[colIndex]))

  console.log(JSON.stringify(columns, null, 2))

  rows = rows.map((row) => row.filter((cell) => cell.type !== TableCellType.Span))

  return {
    rooms,
    rows
  }
}

export function generateAgendaListData (sessions: SessionBase[], roomSequence?: string[]): AgendaListData {
  return {
    sections: Object.entries(groupBy(sessions, (session) => `t-${formatTimeString(session.start)}`))
      .sort((entryA, entryB) => parseInt(entryA[0].slice(2)) - parseInt(entryB[0].slice(2)))
      .map((entry) => {
        const _sessions = roomSequence
          ? entry[1].sort((sessionA, sessionB) => {
            const indexA = roomSequence.indexOf(sessionA.roomId)
            const indexB = roomSequence.indexOf(sessionB.roomId)
            if (indexA === -1 || indexB === -1) throw new Error()

            return indexA - indexB
          })
          : entry[1]
        return {
          start: _sessions[0].start,
          sessions: _sessions.map((_session) => _session.id)
        }
      })
      .filter((section) => section.sessions.length > 0)
  }
}
