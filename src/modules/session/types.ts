/* eslint-disable camelcase */
// Copyright (c) 2021 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import type { Locale } from '@/modules/i18n'

export type RawData = typeof import('@/assets/json/session.json')

export type YearOfDate = number
export type MonthOfDate = number
export type DateOfDate = number
export type DayOfDate = number
export type HourOfDate = number
export type MinuteOfDate = number
export interface PartsOfDate {
  year: YearOfDate;
  month: MonthOfDate;
  date: DateOfDate;
  day: DayOfDate;
  hour: HourOfDate;
  minute: MinuteOfDate;
}

export type SessionId = string
export type RoomId = string
export type SpeakerId = string
export type UrlString = string
export type TagId = string
export type SessionTypeId = string

type LocaleRecord<V> = Record<Locale, V>

export type Room = { id: RoomId; } & LocaleRecord<{ name: string }>
export type Tag = { id: TagId; } & LocaleRecord<{ name: string }>
export type SessionType = { id: SessionTypeId; } & LocaleRecord<{ name: string }>
export type Speaker = { id: SpeakerId; avatar: UrlString; } & LocaleRecord<{ name: string; bio: string }>

export interface Session extends LocaleRecord<{ title: string; description: string; }> {
  id: SessionId;
  type: SessionType;
  room: Room;
  start: Date;
  end: Date;
  language: string;
  speakers: Speaker[];
  tags: Tag[];
  coWrite: null | string;
  qa: null | string;
  slide: null | string;
  record: null | string;
  favorite?: boolean
}

export interface RoomStatus {
  isFull: boolean;
  currentSession: SessionId | null;
}

export type SessionsMap = Record<SessionId, Session>
export type RoomsMap = Record<RoomId, Room>
export type RoomsStatusMap = Record<RoomId, RoomStatus>

// Schedule

export interface ScheduleElement {
  session: SessionId;
  room: RoomId;
  start: Date;
  end: Date;
}

export interface SchedulDay {
  day: [YearOfDate, MonthOfDate, DateOfDate];
  elements: ScheduleElement[];
}

type ScheduleTableCellType = 'room' | 'session' | 'blank' | 'span'

interface ScheduleTableBasicCell {
  type: ScheduleTableCellType;
}

interface ScheduleTableRoomCell extends ScheduleTableBasicCell {
  type: 'room';
  room: RoomId;
}

export interface ScheduleTableSessionCell extends ScheduleTableBasicCell {
  type: 'session';
  rowspan: number;
  element: ScheduleElement;
}

export interface ScheduleTableBlankCell extends ScheduleTableBasicCell {
  type: 'blank';
  rowspan: 1;
}

export interface ScheduleTableSpanCell extends ScheduleTableBasicCell {
  type: 'span';
}

export type ScheduleTableBodyCell = ScheduleTableSessionCell | ScheduleTableBlankCell | ScheduleTableSpanCell

export interface ScheduleTable {
  head: ScheduleTableRoomCell[],
  body: Exclude<ScheduleTableBodyCell, ScheduleTableSpanCell>[][];
}

export interface ScheduleListItem {
  start: [HourOfDate, MinuteOfDate];
  elements: ScheduleElement[];
}

export interface ScheduleList {
  items: ScheduleListItem[];
}

// Filter

export type FilterOptions = {
  label: keyof FilterValue,
  options: {id: string, name: LocaleRecord<string>}[]
}[]

export interface FilterValue {
  type: string,
  room: string[],
  tags: string,
  collection: string,
  filter: string[]
}
