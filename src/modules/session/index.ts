// Copyright (c) 2021 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { computed, InjectionKey, Ref, ref, watch } from 'vue'
import { createModuleHook, useSetupCtx } from '../utils'
import { TIMEZONE_OFFSET, ROOM_ORDER, generateScheduleList, generateScheduleTable, getScheduleDays, transformRawData, generateFilterOption } from './logic'
import { ScheduleElement, SessionsMap, RoomId, ScheduleTable, ScheduleList, Session, SessionId, RoomsMap, Room, RoomsStatusMap, RoomStatus, FilterOptions, FilterValue } from './types'
import { fixedTimeZoneDate } from './utils'
import { useProgress } from '../progress'
import io from 'socket.io-client'
import { useRoute, useRouter } from 'vue-router'

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
  favoriteSessions: Ref<SessionId[]>;
  getSessionById: (id: SessionId) => Session;
  getRoomById: (id: RoomId) => Room;
  getRoomStatusById: (id: RoomId) => RoomStatus;
  load: () => Promise<void>;
}

const PROVIDE_KEY: InjectionKey<UseSession> = Symbol('session')

const _useSession = (): UseSession => {
  const { isClient } = useSetupCtx()
  const { start, done } = useProgress()

  let socket: ReturnType<typeof io> | null = null
  const scheduleElements = ref<ScheduleElement[] | null>(null)
  const _sessionsMap = ref<SessionsMap | null>(null)
  const sessionsMap = computed(() => {
    if (!_sessionsMap.value) return null
    return Object.keys(_sessionsMap.value).reduce((result, key) => {
      return {
        ...result,
        [key]: {
          ..._sessionsMap.value?.[key],
          favorite: favoriteSessions.value.includes(key)
        }
      }
    }, {}) as SessionsMap
  })
  const roomsMap = ref<RoomsMap | null>(null)
  const isLoaded = ref<boolean>(false)
  const filterOptions = ref<FilterOptions>([])
  const favoriteSessions = (() => {
    const _favoriteSessions = ref<SessionId[]>(JSON.parse(window.localStorage.getItem('FAVORITE_SESSIONS') ?? '[]'))
    return computed({
      get: () => _favoriteSessions.value,
      set: (value) => {
        window.localStorage.setItem('FAVORITE_SESSIONS', JSON.stringify(value))
        _favoriteSessions.value = value
      }
    })
  })()

  const load = async () => {
    if (isLoaded.value) return
    start()
    const { default: _rawData } = await import('@/assets/json/session.json')
    const { scheduleElements: _scheduleElements, sessionsMap: __sessionsMap, roomsMap: _roomsMap } =
      transformRawData(_rawData, TIMEZONE_OFFSET, ROOM_ORDER)
    scheduleElements.value = _scheduleElements
    _sessionsMap.value = __sessionsMap
    roomsMap.value = _roomsMap
    isClient && await prepareRoomStatus()
    isLoaded.value = true
    filterOptions.value = generateFilterOption(_rawData)
    done()
  }

  isClient && load()

  const route = useRoute()
  const router = useRouter()
  const filterValue = computed({
    get () {
      return {
        room: route.query.room as string[] ?? ['*'],
        tags: route.query.tags as string ?? '*',
        type: route.query.type as string ?? '*',
        collection: route.query.collection as string ?? '*',
        filter: ((route.query.filter as string)?.match(/.{1,6}/g) as string[]) ?? ['*']
      }
    },
    set (value) {
      const getQueryValue = (data: string) => data !== '*' ? data : undefined
      const query = {
        ...route.query,
        room: value.room.includes('*') ? undefined : value.room,
        tags: getQueryValue(value.tags),
        type: getQueryValue(value.type),
        collection: getQueryValue(value.collection),
        filter: !value.filter.includes('*') ? value.filter.join('') : undefined
      }
      const queryArray = Object.entries(query).filter(([, value]) => value !== undefined)
      router.push({ query: Object.fromEntries(queryArray) })
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

          for (const [key, value] of Object.entries(filterValue.value)) {
            if (value === '*') continue
            if (Array.isArray(value) && value.includes('*')) continue

            switch (key) {
              case 'tags':
                if (!session[key].find(x => x.id === value)) return false
                else continue
              case 'room':
                if (!value.includes(session[key].id)) return false
                else continue
              case 'type':
                if (session[key].id !== value) return false
                else continue
              case 'collection':
                if (!session.favorite) return false
                else continue
              case 'filter':
                if (!value.includes(session.id)) return false
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

  watch(daysSchedule, () => {
    if (daysSchedule.value[currentDayIndex.value].list.items.length > 0) return
    const newIndex = daysSchedule.value.findIndex((day) => day.list.items.length > 0)
    if (newIndex >= 0) {
      currentDayIndex.value = newIndex
    }
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
    favoriteSessions
  }
}

// export const setup = createModuleSetup(PROVIDE_KEY, _useSession)
export const useSession = createModuleHook(PROVIDE_KEY, _useSession)
