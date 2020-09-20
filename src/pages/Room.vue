<template>
  <main id="room" class="page-container">
    <table class="room-table">
      <thead>
        <tr>
          <th class="room">{{ text.table.header.room }}</th>
          <th class="status">{{ text.table.header.status }}</th>
          <th class="session">{{ text.table.header.session }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="roomSession in roomsSession"
          :key="`r-${roomSession.room.id}`"
        >
          <td class="room">
            <span
              class="bubble"
              :class="{ full: roomsStatus[roomSession.room.id] }"
            ></span>
            <span>{{
              roomSession.room[languageType].name.split(" / ")[0]
            }}</span>
          </td>
          <td class="status">
            <span
              class="bubble"
              :class="{ full: roomsStatus[roomSession.room.id] }"
            ></span>
            <span class="text">{{
              roomsStatus[roomSession.room.id]
                ? text.table.body.status.full
                : text.table.body.status.available
            }}</span>
          </td>
          <td class="session">
            <router-link
              v-if="roomSession.session"
              :to="locationOfSession(roomSession.session.id)"
              class="content"
            >
              <h3 class="period">
                {{
                  timePeriodOf(
                    roomSession.session.start,
                    roomSession.session.end
                  )
                }}
              </h3>
              <h2 class="title">
                {{ roomSession.session[languageType].title }}
              </h2>
            </router-link>
            <p v-else class="content empty">{{ text.table.body.empty }}</p>
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<script lang="ts">
import io from 'socket.io-client'
import axios from 'axios'
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import { RoomSession, formatTimeString } from '@/services/agenda'

import '@/assets/scss/pages/room.scss'
import { useRenderedEventDispatcher } from '@/plugins/renderedEventDispatcher'
import { useAgendaService, useLanguageService } from '@/services/hooks'
import { RouteLocationRaw } from 'vue-router'

export default defineComponent({
  name: 'Room',
  setup () {
    const agendaService = useAgendaService()
    const dispatchRenderedEvent = useRenderedEventDispatcher()
    const languageService = useLanguageService()
    const languageType = computed(() => languageService.languageType === 'zh-TW' ? 'zh' : languageService.languageType)
    const text = computed(() => languageService.languagePack.room)
    const timer = ref(-1)
    const roomsSession = ref<RoomSession[]>([])
    const rawRoomsStatus = ref<{ id: string; isFull: boolean }[]>([])
    const roomsStatus = computed(() => Object.fromEntries(rawRoomsStatus.value.map((room) => [room.id, room.isFull])))
    let socket: SocketIOClient.Socket | null = null

    const registerSocket = () => {
      const baseUrl = 'https://coscup2020-room.deviltea.me'
      const updateData = async () => {
        const { data } = await axios.get(`${baseUrl}/api/rooms_status`)
        rawRoomsStatus.value = data.roomsStatus
      }

      try {
        socket = io(baseUrl)
        socket.on('connect', updateData)
        socket.on('update', updateData)
      } catch (error) {
        console.error(error)
      }
    }

    const unregisterSocket = () => {
      if (socket && socket.connected) {
        socket.disconnect()
        socket = null
      }
    }

    const timePeriodOf = (start: Date, end: Date) => `${formatTimeString(start, '：')} ~ ${formatTimeString(end, '：')}`

    const locationOfSession = (sessionId): RouteLocationRaw => ({
      name: 'AgendaDetail',
      params: {
        sessionId
      },
      query: {
        from: 'room'
      }
    })

    onMounted(async () => {
      await agendaService.init()
      dispatchRenderedEvent()
      await nextTick()
      timer.value = setInterval((function cb () {
        roomsSession.value = agendaService.getRoomsInProgressSession()
        return cb
      })(), 3000)
      registerSocket()
    })

    onBeforeUnmount(() => {
      clearInterval(timer.value)
      unregisterSocket()
    })

    return {
      text,
      languageType,
      roomsSession,
      roomsStatus,
      timePeriodOf,
      locationOfSession
    }
  }
})
</script>
