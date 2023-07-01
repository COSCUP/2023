// Copyright (c) 2021 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import markdown from '@/utils/markdown/render'
import { getRootUrl } from '@/utils/common'
import { truncate, uniq, uniqWith, escape } from 'lodash'
import { fixedTimeZoneDate, formatDateString, formatTimeString, getPartsOfDate, html, padNumberStart2WithZero } from './utils'
import type { Locale } from '../i18n'
import type { MetaOptions } from '../metas'
import type { PopUpData } from '../pop-up'
import type { Session, ScheduleElement, RawData, SessionType, Room, Speaker, Tag, SessionsMap, ScheduleList, YearOfDate, MonthOfDate, DateOfDate, SchedulDay, HourOfDate, MinuteOfDate, ScheduleTable, RoomId, ScheduleTableBodyCell, ScheduleTableBlankCell, ScheduleTableSpanCell, RoomsMap } from './types'

export const TIMEZONE_OFFSET: number = -480
// export const ROOM_ORDER = []
export const ROOM_ORDER: RoomId[] = [
  'RB105',
  'AU101',
  'TR209', 'TR211', 'TR212', 'TR213', 'TR214',
  'TR310-1', 'TR310-2', 'TR311', 'TR313',
  'TR409-1', 'TR409-2', 'TR410', 'TR411', 'TR412-1', 'TR412-2', 'TR413-1', 'TR413-2',
  'TR510'
]

function mapSessionsWithIndex (sessions: Session[]):SessionsMap {
  return Object.fromEntries(sessions.map(s => [s.id, s]))
}

function filterAndSortScheduleElements (elements: ScheduleElement[], roomOrder: RoomId[]): ScheduleElement[] {
  return elements
    // .sort((a, b) => {
    //   if (a.room === 'Main Track') return -1
    //   if (b.room === 'Main Track') return 1
    //   return a.room.charCodeAt(0) - b.room.charCodeAt(0)
    // })
    .filter(e => {
      const result = roomOrder.includes(e.room)
      !result && console.warn(`Session: ${e.session}'s room: ${e.room} is not in provided roomOrder`)
      return result
    })
    .sort((a, b) => roomOrder.indexOf(a.room) - roomOrder.indexOf(b.room))
}

function getTimePoints (elements: ScheduleElement[], includeEndTime = true): [HourOfDate, MinuteOfDate][] {
  const format = (time: [HourOfDate, MinuteOfDate]) => time.map(padNumberStart2WithZero).join('')
  const timePoints = uniqWith<[HourOfDate, MinuteOfDate]>(
    elements
      .flatMap(s => includeEndTime
        ? [getPartsOfDate(s.start), getPartsOfDate(s.end)]
        : [getPartsOfDate(s.start)])
      .map(({ hour, minute }) => [hour, minute]),
    (a, b) => format(a) === format(b)
  ).sort((a, b) => +format(a) - +format(b))
  return timePoints
}

export function transformRawData (rawData: RawData, timeZoneOffsetMinutes: number | null = null, roomOrder: RoomId[]) {
  type RawSession = RawData['sessions'][number]

  const createDate = (date: Date | string) => timeZoneOffsetMinutes === null
    ? new Date(date)
    : fixedTimeZoneDate(date, timeZoneOffsetMinutes)

  function transformToScheduleElement (rawSession: RawSession): ScheduleElement {
    return {
      session: rawSession.id,
      room: rawSession.room,
      start: createDate(rawSession.start),
      end: createDate(rawSession.end)
    }
  }

  function transformToSession ({ id, language, co_write: coWrite, qa, slide, record, en, zh, ...rawRest }: RawSession): Session {
    const type = ((): SessionType => {
      const { zh, ...rest } = rawData.session_types.find(t => t.id === rawRest.type)!
      return { ...rest, 'zh-TW': zh }
    })()
    const room = ((): Room => {
      const { zh, en, ...rest } = rawData.rooms.find(r => r.id === rawRest.room)!
      return {
        id: rest.id,
        en: { name: en.name || rest.id },
        'zh-TW': zh
      }
    })()
    const speakers = ((): Speaker[] => {
      return rawRest.speakers
        .map(s => rawData.speakers.find(d => d.id === s)!)
        .map(({ zh, ...rest }) => ({ ...rest, 'zh-TW': zh }))
    })()
    const tags = ((): Tag[] => {
      return rawRest.tags.map(t => rawData.tags.find(d => d.id === t)!)
        .map(({ zh, ...rest }) => ({ ...rest, 'zh-TW': zh }))
    })()
    return {
      id,
      en,
      'zh-TW': zh,
      room,
      type,
      start: createDate(rawRest.start),
      end: createDate(rawRest.end),
      language,
      speakers,
      tags,
      coWrite,
      qa,
      slide,
      record: record ?? null
    }
  }

  const tuples: [ScheduleElement, Session][] = rawData.sessions
    .map<[ScheduleElement, Session]>((rawSession) =>
      [transformToScheduleElement(rawSession), transformToSession(rawSession)])
  const scheduleElements = filterAndSortScheduleElements(tuples.map(([d]) => d), roomOrder)
  const sessionsMap = mapSessionsWithIndex(tuples.map(([_, d]) => d))
  const roomsMap: RoomsMap = Object.fromEntries(rawData.rooms
    .filter(r => roomOrder.includes(r.id))
    .sort((a, b) => roomOrder.indexOf(a.id) - roomOrder.indexOf(b.id))
    .map(
      r => [r.id, {
        id: r.id,
        en: r.en,
        'zh-TW': r.zh
      }])
  )

  return {
    roomsMap,
    scheduleElements,
    sessionsMap
  }
}

export function getScheduleDays (elements: ScheduleElement[]): SchedulDay[] {
  const format = (time: [YearOfDate, MonthOfDate, DateOfDate]) => time.join('/')
  const days = uniqWith<[YearOfDate, MonthOfDate, DateOfDate]>(
    elements
      .map(s => getPartsOfDate(s.start))
      .map(({ year, month, date }) => [year, month, date]),
    (a, b) => format(a) === format(b)
  )
  return days
    .sort((a, b) =>
      +a.map(padNumberStart2WithZero).join('') - +b.map(padNumberStart2WithZero).join(''))
    .map(day => {
      const filtered = elements.filter(s => {
        const { year, month, date } = getPartsOfDate(s.start)
        const d: [YearOfDate, MonthOfDate, DateOfDate] = [year, month, date]
        return format(day) === format(d)
      })
      return {
        day,
        elements: filtered
      }
    })
}

export function generateScheduleTable (elements: ScheduleElement[]): ScheduleTable {
  const rooms: RoomId[] = uniq(elements.map(e => e.room))
  const timePoints = getTimePoints(elements)

  const blankCell: ScheduleTableBlankCell = {
    type: 'blank',
    rowspan: 1
  }
  const spanCell: ScheduleTableSpanCell = {
    type: 'span'
  }

  const columnsOfBody = rooms.map(r => elements.filter(e => e.room === r))
    .map(els => {
      const cells: ScheduleTableBodyCell[] = timePoints.slice(0, -1).map(() => blankCell)
      els.forEach(e => {
        const [startIndex, endIndex] = [e.start, e.end]
          .map(d => {
            const { hour, minute } = getPartsOfDate(d)
            return timePoints.findIndex(([h, m]) => h === hour && m === minute)
          })
        const span = endIndex - startIndex
        if (cells.slice(startIndex, endIndex).some(c => c.type !== 'blank')) {
          console.warn(`Session: ${e.session} is overlapping with others`)
          return
        }
        cells.splice(startIndex, span, ...(new Array(span)).fill(spanCell))
        cells.splice(startIndex, 1, {
          type: 'session',
          rowspan: span,
          element: e
        })
      })
      return cells
    })

  const rowsOfBody: Exclude<ScheduleTableBodyCell, ScheduleTableSpanCell>[][] = timePoints.slice(0, -1)
    .map((tp, rowIndex) =>
      rooms.map((r, colIndex) =>
        columnsOfBody[colIndex][rowIndex]))
    .map(row => row.filter(cell => cell.type !== 'span') as Exclude<ScheduleTableBodyCell, ScheduleTableSpanCell>[])

  return {
    head: rooms.map(r => ({ type: 'room', room: r })),
    body: rowsOfBody
  }
}

export function generateScheduleList (elements: ScheduleElement[]): ScheduleList {
  return {
    items: getTimePoints(elements, false)
      .map(tp => ({
        start: tp,
        elements: elements
          .filter(e => {
            const format = (time: [HourOfDate, MinuteOfDate]) =>
              time.map(padNumberStart2WithZero).join('')
            const { hour, minute } = getPartsOfDate(e.start)
            const t: [HourOfDate, MinuteOfDate] = [hour, minute]
            return format(tp) === format(t)
          })
      }))
  }
}

export function generateSessionPopupContentHtml (session: Session, community: { id: string, name: { 'zh-TW': string, en: string } } | undefined, locale: Locale) {
  return html`
  <article id="session-detail" class="session-detail">
    <header class="detail-header">
      <div class="date">
        ${formatDateString(session.start, ' / ')}
      </div>
      <div class="period">
        ${formatTimeString(session.start, '：')} ~ ${formatTimeString(session.end, '：')}
      </div>
      <div class="track">
        <span class="room">${session.room[locale].name.split(' / ')[0]}</span>
        <span>${session.type[locale].name}${community ? `<span class="community">&nbsp;by <a href="${getRootUrl()}community#${community.id}" target="_blank">${community.name[locale]}</a></span>` : ''}</span>
      </div>
      <div class="title">${session[locale].title}</div>
      <div class="speaker-list">
        <span>by</span>
        ${
          session.speakers
            .map((speaker) => `<span class="speaker">${speaker[locale].name}</span>`)
            .join('')
        }
      </div>
      <div class="tag-list">
        ${
          session.tags
            .map((tag) => `<span>${tag[locale].name}</span>`)
            .join('')
        }
      </div>
    </header>
    <section class="detail-description markdown">
      ${markdown(session[locale].description)}
    </section>
    <section class="detail-attachment">
      ${
        session.record
          ? html`
      <div class="record-container">
        <div class="record-wrapper">
          <iframe
            class="record"
            src="https://www.youtube-nocookie.com/embed/${session.record.split('?v=').pop()}"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          >
          </iframe>
        </div>
      </div>`
          : ''
      }
      ${
        session.coWrite
          ? html`
      <div class="outer-link">
        <span>${locale === 'en' ? 'Collaborative note:' : '共筆:'}</span>
        <a href="${session.coWrite}" target="_blank" rel="noopener noreferrer">${session.coWrite}</a>
      </div>`
          : ''
      }
      ${
        session.qa
          ? html`
      <div class="outer-link">
        <span>${locale === 'en' ? 'Q&A:' : '提問區:'}</span>
        <a href="${session.qa}" target="_blank" rel="noopener noreferrer">${session.qa}</a>
      </div>`
          : ''
      }
      ${
        session.slide
          ? html`
      <div class="outer-link">
        <span>${locale === 'en' ? 'Slide:' : '簡報:'}</span>
        <a href="${session.slide}" target="_blank" rel="noopener noreferrer">${session.slide}</a>
      </div>`
          : ''
      }
    </section>
    <section class="detail-speakers">
      ${(session.speakers.map((speaker) => ({
        avatar: speaker.avatar,
        name: speaker[locale].name,
        bio: markdown(speaker[locale].bio)
      }))).map((speaker) => html`
      <h2 class="speaker-title">About ${speaker.name}</h2>
      <div class="speaker-content">
        <img class="avatar" alt="Speaker ${speaker.name}'s avatar" src="${speaker.avatar}"></img>
        <div class="bio markdown">
          ${speaker.bio}
        </div>
      </div>
      `).join('')}
    </section>
  </article>`
}

export function generateSessionMetaOptions (session: Session, locale: Locale): MetaOptions {
  return {
    title: session[locale].title,
    description: escape(truncate(session[locale].description, { length: 80 })),
    ogUrl: `${getRootUrl()}${locale}/session/${session.id}`,
    ogImage: session.speakers.length > 0 ? session.speakers[Math.floor(Math.random() * session.speakers.length)].avatar : undefined
  }
}

export function generateSessionPopupData (session: Session, community: { id: string, name: { 'zh-TW': string, en: string } } | undefined, locale: Locale): PopUpData {
  return {
    popupId: `session-${session.id}`,
    metaOptions: generateSessionMetaOptions(session, locale),
    containerData: {
      type: 'session'
    },
    contentData: {
      type: 'html',
      html: generateSessionPopupContentHtml(session, community, locale)
    }
  }
}

export function generateFilterOption (rawData: RawData) {
  const result = []

  const payload = { room: 'rooms', tags: 'tags', type: 'session_types' } as const
  for (const key in payload) {
    const label = key as keyof typeof payload
    result.push({
      label,
      options: rawData[payload[label]].map(({ id, en, zh }: any) => ({
        id,
        name: { en: en.name, 'zh-TW': zh.name }
      }))
    })
  }

  return result
}
