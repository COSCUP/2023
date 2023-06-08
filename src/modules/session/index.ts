// Copyright (c) 2021 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { computed, InjectionKey, Ref, ref } from 'vue'
import { createModuleHook, useSetupCtx } from '../utils'
import { TIMEZONE_OFFSET, ROOM_ORDER, generateScheduleList, generateScheduleTable, getScheduleDays, transformRawData, generateFilterOption } from './logic'
import { ScheduleElement, SessionsMap, RoomId, ScheduleTable, ScheduleList, Session, SessionId, RoomsMap, Room, RoomsStatusMap, RoomStatus, FilterOptions, FilterValue } from './types'
import { fixedTimeZoneDate } from './utils'
import { useProgress } from '../progress'
import io, { Socket } from 'socket.io-client'
import { useRoute } from 'vue-router'

interface UseSession {
  isLoaded: Ref<boolean>;
  currentDayIndex: Ref<number>;
  daysSchedule: Ref<{
    day: [number, number, number];
    table: ScheduleTable;
    list: ScheduleList;
  }[]>;
  filterOptions: Ref<FilterOptions>;
  filterValue: Ref<FilterValue>;
  roomsStatusMap: Ref<RoomsStatusMap | null>;
  sessionsMap: Ref<SessionsMap | null>;
  getSessionById: (id: SessionId) => Session;
  getRoomById: (id: RoomId) => Room;
  getRoomStatusById: (id: RoomId) => RoomStatus;
  load: () => Promise<void>;
  handleFilterValueChange: (label: string, value: string) => void
}

const PROVIDE_KEY: InjectionKey<UseSession> = Symbol('session')

const _useSession = (): UseSession => {
  const { isClient } = useSetupCtx()
  const { start, done } = useProgress()

  let socket: typeof Socket | null = null
  const scheduleElements = ref<ScheduleElement[] | null>(null)
  const sessionsMap = ref<SessionsMap | null>(null)
  const roomsMap = ref<RoomsMap | null>(null)
  const isLoaded = ref<boolean>(false)
  const filterOptions = ref<FilterOptions>([])

  const load = async () => {
    if (isLoaded.value) return
    start()
    const { default: _rawData } = await import('@/assets/json/session.json')
    const { scheduleElements: _scheduleElements, sessionsMap: _sessionsMap, roomsMap: _roomsMap } =
      transformRawData(_rawData, TIMEZONE_OFFSET, ROOM_ORDER)
    scheduleElements.value = _scheduleElements
    sessionsMap.value = _sessionsMap
    roomsMap.value = _roomsMap
    isClient && await prepareRoomStatus()
    isLoaded.value = true
    filterOptions.value = generateFilterOption(_rawData)
    done()

    const markSessions: SessionId[] = JSON.parse(window.localStorage.getItem('MARK_SESSIONS') ?? '[]')
    for (const id in sessionsMap.value) {
      const session: Session = sessionsMap.value?.[id]
      session.favorite = markSessions.includes(id)
    }
  }

  isClient && load()

  const { query } = useRoute()
  const _filterValue = ref<FilterValue>({ room: '*', tags: '*', type: '*', collection: '*', ...query })
  const filterValue = computed({
    get () { return _filterValue.value },
    set ({ label, value }) {
      _filterValue.value[label] = value
    }
  })

  const currentDayIndex = ref(0)
  const daysSchedule = computed(() => {
    if (scheduleElements.value === null) return []
    return getScheduleDays(scheduleElements.value)
      .map((scheduleDay) => {
        const day = scheduleDay.day
        const elements = scheduleDay.elements.filter(s => {
          const session = getSessionById(s.session)

          for (const filter of Object.entries(filterValue.value)) {
            if (filter[1] === '*') continue

            switch (filter[0]) {
              case 'tags':
                if (!session[filter[0]].find(x => x.id === filter[1])) return false
                else continue
              case 'room':
              case 'type':
                if (session[filter[0]].id !== filter[1]) return false
                else continue
              case 'collection':
                if (!session.favorite) return false
                else continue
            }
          }

          return true
        })
        const table = generateScheduleTable(elements)
        const list = generateScheduleList(elements)
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
  const roomsIsFull = ref<Record<RoomId, boolean>>({})
  const roomsStatusMap = computed<RoomsStatusMap | null>(() => {
    if (roomsMap.value === null) return null
    return Object.fromEntries(
      Object.keys(roomsMap.value)
        .map(roomId => {
          const isFull = roomsIsFull.value[roomId] ?? false
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

  async function prepareRoomStatus () {
    const apiEndPoint = import.meta.env.VITE_ROOM_STATUS_API
    if (!apiEndPoint || typeof apiEndPoint !== 'string') return
    if (!socket) {
      socket = io(apiEndPoint)
      socket.emit('data')
    }
    socket.on('data', (data: Record<RoomId, boolean>) => { roomsIsFull.value = data })
    socket.on('update', (diff: Record<RoomId, boolean>) => {
      Object.keys(diff).forEach((key) => {
        roomsIsFull.value[key] = diff[key]
      })
    })
  }

  function handleFilterValueChange (label:string, value:string) {
    filterValue.value = { label, value }
  }

  return {
    isLoaded,
    currentDayIndex,
    daysSchedule,
    roomsStatusMap,
    filterOptions,
    filterValue,
    sessionsMap,
    getSessionById,
    getRoomById,
    getRoomStatusById,
    load,
    handleFilterValueChange
  }
}

// export const setup = createModuleSetup(PROVIDE_KEY, _useSession)
export const useSession = createModuleHook(PROVIDE_KEY, _useSession)
