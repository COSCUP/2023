<template>
  <main id="room" class="page-container">
    <ClientOnly>
      <table v-if="roomsStatusMap" class="room-table">
        <thead>
          <tr>
            <th class="room">{{ t('room.table.header.room') }}</th>
            <th class="status">{{ t('room.table.header.status') }}</th>
            <th class="session">{{ t('room.table.header.session') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(status, roomId) in roomsStatusMap" :key="`r-${roomId}`">
            <td class="room">
              <div class="status" :class="{ full: status.isFull }">
                <span class="text">
                  {{
                    t(`room.table.body.status['${status.isFull ? 'full' : 'available'}']`)
                  }}
                </span>
              </div>
              <span>
                {{
                  getRoomById(roomId)[locale].name.split(" / ")[0]
                }}
              </span>
            </td>
            <td class="status" :class="{ full: status.isFull }">
              {{
                t(`room.table.body.status['${status.isFull ? 'full' : 'available'}']`)
              }}
            </td>
            <td class="session">
              <router-link
                v-if="status.currentSession"
                :to="{
                  name: 'SessionDetail',
                  params: {
                    sessionId: status.currentSession
                  },
                  query: {
                    from: 'Room'
                  }
                }"
                class="content"
              >
                <h3 class="period">
                  {{
                    timePeriodOf(status.currentSession)
                  }}
                </h3>
                <h2 class="title">{{ getSessionById(status.currentSession)[locale].title }}</h2>
              </router-link>
              <p v-else class="content empty">{{ t('room.table.body.empty') }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </ClientOnly>
  </main>
</template>

<script lang="ts">
// import io, { Socket } from 'socket.io-client'
// import axios from 'axios'
import { defineComponent, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSession } from '@/modules/session'
import { Locale } from '@/modules/i18n'
import { SessionId } from '@/modules/session/types'
import { formatTimeString } from '@/modules/session/utils'
import '@/assets/scss/pages/room.scss'

export default defineComponent({
  name: 'Room',
  setup () {
    const { t, locale } = useI18n()
    const { load, roomsStatusMap, getRoomById, getSessionById } = useSession()
    const timePeriodOf = (sessionId: SessionId) => {
      const { start, end } = getSessionById(sessionId)
      return `${formatTimeString(start, '：')} ~ ${formatTimeString(end, '：')}`
    }

    return {
      t,
      locale: locale as Ref<Locale>,
      timePeriodOf,
      roomsStatusMap,
      getRoomById,
      getSessionById,
      load
    }
  },
  async serverPrefetch () {
    await this.load()
  }
  // setup () {
  //   const { locale, tm } = useI18n()
  //   const { initAgenda, getRoomsInProgressSession } = useStore()
  //   const languageType = computed(() => (locale.value === 'zh-TW' ? 'zh' : locale.value) as ('en' | 'zh'))
  //   const text = computed(() => tm('room') as RoomMessages)
  //   const timer = ref(-1)
  //   const roomsSession = ref<RoomSession[]>([])
  //   const rawRoomsStatus = ref<{ id: string; isFull: boolean }[]>([])
  //   const roomsStatus = computed(() => Object.fromEntries(rawRoomsStatus.value.map((room) => [room.id, room.isFull])))
  //   let socket: typeof Socket | null = null

  //   const registerSocket = () => {
  //     const baseUrl = 'https://coscup2020-room.deviltea.me'
  //     const updateData = async () => {
  //       const { data } = await axios.get(`${baseUrl}/api/rooms_status`)
  //       rawRoomsStatus.value = data.roomsStatus
  //     }

  //     try {
  //       socket = io(baseUrl)
  //       socket.on('connect', updateData)
  //       socket.on('update', updateData)
  //     } catch (error) {
  //       console.error(error)
  //     }
  //   }

  //   const unregisterSocket = () => {
  //     if (socket && socket.connected) {
  //       socket.disconnect()
  //       socket = null
  //     }
  //   }

  //   const timePeriodOf = (start: Date, end: Date) => `${formatTimeString(start, '：')} ~ ${formatTimeString(end, '：')}`

  //   const locationOfSession = (sessionId: string): RouteLocationRaw => ({
  //     name: 'AgendaDetail',
  //     params: {
  //       sessionId
  //     },
  //     query: {
  //       from: 'room'
  //     }
  //   })

  //   onMounted(async () => {
  //     await initAgenda()
  //     await nextTick()
  //     timer.value = window.setInterval((function cb () {
  //       roomsSession.value = getRoomsInProgressSession()
  //       return cb
  //     })(), 3000)
  //     registerSocket()
  //   })

  //   onBeforeUnmount(() => {
  //     clearInterval(timer.value)
  //     unregisterSocket()
  //   })

  //   return {
  //     text,
  //     languageType,
  //     roomsSession,
  //     roomsStatus,
  //     timePeriodOf,
  //     locationOfSession
  //   }
  // }
})
</script>
