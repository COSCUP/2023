// Copyright (c) 2021 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { computed, InjectionKey, Ref, ref } from 'vue'
import { createModuleHook, createModuleSetup, useSetupCtx } from '../utils'
import { generateScheduleList, generateScheduleTable, getScheduleDays, transformRawData } from './logic'
import { ScheduleElement, SessionsMap, RoomId, ScheduleTable, ScheduleList, Session, SessionId, RoomsMap, Room, RoomsStatusMap, RoomStatus } from './types'
import { fixedTimeZoneDate } from './utils'
import rawData from '@/assets/json/session.json'

interface UseSession {
  isLoaded: Ref<boolean>;
  currentDayIndex: Ref<number>;
  daysSchedule: Ref<{
    day: [number, number, number];
    table: ScheduleTable;
    list: ScheduleList;
  }[]>;
  roomsStatusMap: Ref<RoomsStatusMap | null>;
  getSessionById: (id: SessionId) => Session;
  getRoomById: (id: RoomId) => Room;
  getRoomStatusById: (id: RoomId) => RoomStatus;
}

const PROVIDE_KEY: InjectionKey<UseSession> = Symbol('session')
export const TIMEZONE_OFFSET: number = -480
export const ROOM_ORDER: RoomId[] = [
  'RB105',
  'AU',
  'TR209', 'TR211', 'TR212', 'TR213', 'TR214',
  'TR309', 'TR311', 'TR313',
  'TR409-2', 'TR410', 'TR411', 'TR412-1', 'TR412-2', 'TR413-1', 'TR413-2'
]
const { scheduleElements: _scheduleElements, sessionsMap: _sessionsMap, roomsMap: _roomsMap } =
          transformRawData(rawData, TIMEZONE_OFFSET, ROOM_ORDER)

const _useSession = (): UseSession => {
  const { isClient } = useSetupCtx()

  const scheduleElements = ref<ScheduleElement[]>(_scheduleElements)
  const sessionsMap = ref<SessionsMap>(_sessionsMap)
  const roomsMap = ref<RoomsMap>(_roomsMap)
  const isLoaded = ref<boolean>(true)
  const currentDayIndex = ref(0)
  const daysSchedule = computed(() => {
    if (scheduleElements.value === null) return []
    return getScheduleDays(scheduleElements.value)
      .map((scheduleDay) => {
        const day = scheduleDay.day
        const table = generateScheduleTable(scheduleDay.elements)
        const list = generateScheduleList(scheduleDay.elements)
        return { day, table, list }
      })
  })

  const getSessionById = (id: SessionId): Session => {
    const session = sessionsMap.value?.[id] ?? null
    if (session === null) throw new Error(`Can not find session: ${id} in sessions map`)
    return session
  }

  const getRoomById = (id: RoomId): Room => {
    const room = roomsMap.value?.[id] ?? null
    if (room === null) throw new Error(`Can not find room: ${id} in rooms map`)
    return room
  }

  const currentSessions = ref<Session[]>([])
  const roomsIsFull = ref<Record<RoomId, boolean>>(Object.fromEntries(Object.keys(_roomsMap).map(id => [id, false])))
  const roomsStatusMap = computed<RoomsStatusMap>(() => {
    return Object.fromEntries(
      Object.keys(roomsMap.value)
        .map(roomId => {
          const isFull = roomsIsFull.value![roomId]
          const currentSession = currentSessions.value.find(s => s.room.id === roomId)?.id ?? null
          return [roomId, { isFull, currentSession } as RoomStatus]
        })
    )
  })
  const getRoomStatusById = (id: RoomId): RoomStatus => {
    const status = roomsStatusMap.value?.[id]
    if (!status) throw new Error(`Can not find room: ${id} in rooms' status map`)
    return status
  }

  isClient && setInterval(() => {
    if (sessionsMap.value === null) {
      currentSessions.value = []
      return
    }
    const currentTime = fixedTimeZoneDate(new Date(), TIMEZONE_OFFSET).getTime()
    // const currentTime = fixedTimeZoneDate(new Date('2020-08-01 13:00'), TIMEZONE_OFFSET).getTime()
    currentSessions.value = Object.values(sessionsMap.value)
      .filter(s => s.start.getTime() <= currentTime && currentTime <= s.end.getTime())
  }, 3000)

  return {
    isLoaded,
    currentDayIndex,
    daysSchedule,
    roomsStatusMap,
    getSessionById,
    getRoomById,
    getRoomStatusById
  }
}

export const setup = createModuleSetup(PROVIDE_KEY, _useSession)
export const useSession = createModuleHook(PROVIDE_KEY, _useSession)
