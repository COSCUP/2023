<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main id="agenda" class="page-container">
    <AgendaNavbar v-model="dayIndex" />
    <template v-for="(dayData, index) in daysData">
      <AgendaTable
        v-if="dayData !== null"
        v-show="dayIndex === index && breakpointService.smAndUp"
        :key="`table-${dayData.day.join('')}`"
        :table="dayData.table"
      />
      <AgendaList
        v-if="dayData !== null"
        v-show="dayIndex === index && breakpointService.xsOnly"
        :key="`list-${dayData.day.join('')}`"
        :list="dayData.list"
      />
    </template>
  </main>
</template>

<script lang="ts">
import io from 'socket.io-client'
import axios from 'axios'
import { defineComponent, computed, watch, onMounted, provide, ref, onBeforeUnmount, nextTick } from 'vue'
import { RouteLocationNormalized, useRouter } from 'vue-router'
import { DayData } from '@/services/agenda'
import { useLanguageService, usePopupService, useBreakpointService, useAgendaService, useFullPageProgressService } from '@/services/hooks'
import { PopupData } from '@/services/popup'
import { useRenderedEventDispatcher } from '@/plugins/renderedEventDispatcher'
import { scrollTo } from '@/utils/scrollTo'
import AgendaNavbar from '@/components/Agenda/AgendaNavbar.vue'
import AgendaTable from '@/components/Agenda/AgendaTable.vue'
import AgendaList from '@/components/Agenda/AgendaList.vue'

import '@/assets/scss/pages/agenda.scss'

export default defineComponent({
  name: 'Agenda',
  components: {
    AgendaNavbar,
    AgendaTable,
    AgendaList
  },
  setup () {
    const dispatchRenderedEvent = useRenderedEventDispatcher()
    const router = useRouter()
    const fullPageProgressService = useFullPageProgressService()
    const languageService = useLanguageService()
    const popupService = usePopupService()
    const breakpointService = useBreakpointService()
    const agendaService = useAgendaService()
    const languageType = computed(() => languageService.languageType === 'zh-TW' ? 'zh' : languageService.languageType)
    const rawRoomsStatus = ref<{ id: string; isFull: boolean }[]>([])
    const roomsStatus = computed(() => Object.fromEntries(rawRoomsStatus.value.map((room) => [room.id, room.isFull])))
    let socket: SocketIOClient.Socket | null = null
    const dayIndex = ref(0)
    const daysData = ref<(DayData | null)[]>([])

    const onSessionPopupClose = () => {
      if (router.currentRoute.value.name === 'AgendaDetail') {
        const isFromRoomPage = router.currentRoute.value.query.from === 'room'
        router.push({
          ...router.currentRoute,
          name: isFromRoomPage ? 'Room' : 'Agenda',
          query: {
            ...router.currentRoute.value.query,
            from: undefined
          }
        })
      }
    }

    const popupSession = async (sessionId = '') => {
      const popupData: PopupData = sessionId === 'template'
        ? {
          popupId: 'session-template',
          metaOptions: {
            title: 'Template'
          },
          containerData: {
            type: 'default'
          },
          contentData: {
            type: 'general',
            html: '<article id="session-detail" class="session-detail"><h1>Session Popup Template</h1></article>'
          }
        }
        : await agendaService.getSessionPopupData(sessionId, languageType.value)

      popupService.popup({
        ...popupData,
        onClose: onSessionPopupClose
      })
    }

    const processByRoute = async (route: RouteLocationNormalized) => {
      if (route.name === 'AgendaDetail') {
        try {
          await popupSession(route.params.sessionId as string)
        } catch (error) {
          await router.replace({
            ...router.currentRoute,
            name: 'Agenda'
          })
        }
      } else if (route.name === 'Agenda') {
        popupService.close()
      }
    }

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

    watch(() => dayIndex.value, (value) => {
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
      const { cancel } = scrollTo({
        to: { left: 0, top: 0 },
        duration: isSafari ? 10 : undefined
      })
      const events = ['wheel', 'mousewheel', 'DOMMouseScroll']
      const onScrolling = () => {
        events.forEach((event) => window.removeEventListener(event, onScrolling))
        cancel()
      }
      events.forEach((event) => window.addEventListener(event, onScrolling))

      if (daysData.value[value] === null) {
        daysData.value.splice(value, 1, agendaService.getDayData(value))
      }
    })

    watch(() => router.currentRoute.value, processByRoute)

    onMounted(async () => {
      fullPageProgressService.setStatus(true)
      await agendaService.init()
      daysData.value = agendaService.days.map(() => null)
      daysData.value.splice(dayIndex.value, 1, agendaService.getDayData(dayIndex.value))
      await processByRoute(router.currentRoute.value)
      fullPageProgressService.setStatus(false)
      dispatchRenderedEvent()
      await nextTick()
      registerSocket()
    })

    onBeforeUnmount(() => {
      unregisterSocket()
    })

    provide('agendaService', agendaService)
    provide('languageType', languageType)
    provide('roomsStatus', roomsStatus)

    return {
      breakpointService,
      dayIndex,
      daysData,
      roomsStatus
    }
  }
})
</script>
