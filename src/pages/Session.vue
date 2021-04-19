<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main id="session" class="page-container">
    <ScheduleNavbar />
    <template v-for="(schedule, index) in daysSchedule">
      <ScheduleList
        v-if="xsOnly"
        v-show="currentDayIndex === index"
        :key="`list-${schedule.day.join('')}`"
        :list="schedule.list"
      />
      <ScheduleTable
        v-else
        v-show="currentDayIndex === index"
        :key="`table-${schedule.day.join('')}`"
        :table="schedule.table"
      />
    </template>
  </main>
</template>

<script lang="ts">
// import io, { Socket } from 'socket.io-client'
// import axios from 'axios'
import { defineComponent, watch } from 'vue'
import { useBreakpoints } from '@/modules/breakpoints'
import { useSession } from '@/modules/session'
import ScheduleNavbar from '@/components/Session/ScheduleNavbar.vue'
import ScheduleTable from '@/components/Session/ScheduleTable.vue'
import ScheduleList from '@/components/Session/ScheduleList.vue'

import '@/assets/scss/pages/session.scss'
import { usePopUp } from '@/modules/pop-up'
import { useRoute, useRouter } from 'vue-router'
import { generateSessionPopupData } from '@/modules/session/logic'
import { useI18n } from 'vue-i18n'
import { Locale } from '@/modules/i18n'
import { isClient } from '@vueuse/shared'

export default defineComponent({
  name: 'Session',
  components: {
    ScheduleNavbar,
    ScheduleTable,
    ScheduleList
  },
  setup () {
    const route = useRoute()
    const router = useRouter()
    const { daysSchedule, currentDayIndex, getSessionById, isLoaded } = useSession()
    const { openPopUp } = usePopUp()
    const { xsOnly } = useBreakpoints()
    const { locale } = useI18n()

    watch(() => [route.params.sessionId, isLoaded.value], ([sessionId, bool], past) => {
      if (!bool || !sessionId || typeof sessionId !== 'string') return
      const onClose = () => {
        router.push({
          name: route.query.from === 'Room'
            ? 'Room'
            : 'Session'
        })
      }
      if (sessionId === 'template') {
        openPopUp({
          popupId: 'session-template',
          metaOptions: {
            title: '@{TEMPLATE_META_TITLE}',
            description: '@{TEMPLATE_META_DESCRIPTION}',
            ogUrl: '@{TEMPLATE_META_OG_URL}',
            ogImage: '@{TEMPLATE_META_OG_IMAGE}'
          },
          containerData: {
            type: 'default'
          },
          contentData: {
            type: 'html',
            html: '@{TEMPLATE_CONTENT_HTML}'
          },
          onClose
        })
      } else {
        openPopUp({
          ...generateSessionPopupData(
            getSessionById(sessionId),
            locale.value as Locale
          ),
          onClose
        })
      }
    }, {
      immediate: true
    })

    isClient && watch(currentDayIndex, async () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    })

    return {
      xsOnly,
      currentDayIndex,
      daysSchedule
    }
  }
  // setup () {
  //   const router = useRouter()
  //   const { setFullPageProgressStatus, popup, closePopup, getSessionPopupData, agendaDaysData: daysData, initAgenda } = useStore()
  //   const { smAndUp, xsOnly } = useBreakpoints()
  //   const { languageType: _languageType } = useStore()
  //   const languageType = computed(() => _languageType.value === 'zh-TW' ? 'zh' : _languageType.value)
  //   const rawRoomsStatus = ref<{ id: string; isFull: boolean }[]>([])
  //   const roomsStatus = computed(() => Object.fromEntries(rawRoomsStatus.value.map((room) => [room.id, room.isFull])))
  //   let socket: typeof Socket | null = null
  //   const dayIndex = ref(0)

  //   const onSessionPopupClose = () => {
  //     if (router.currentRoute.value.name === 'AgendaDetail') {
  //       const isFromRoomPage = router.currentRoute.value.query.from === 'room'
  //       router.push({
  //         ...router.currentRoute,
  //         name: isFromRoomPage ? 'Room' : 'Agenda',
  //         query: {
  //           ...router.currentRoute.value.query,
  //           from: undefined
  //         }
  //       })
  //     }
  //   }

  //   const popupSession = async (sessionId = '') => {
  //     const popupData: PopupData = sessionId === 'template'
  //       ? {
  //           popupId: 'session-template',
  //           metaOptions: {
  //             title: 'Template'
  //           },
  //           containerData: {
  //             type: 'default'
  //           },
  //           contentData: {
  //             type: 'general',
  //             html: '<article id="session-detail" class="session-detail"><h1>Session Popup Template</h1></article>'
  //           }
  //         }
  //       : await getSessionPopupData(sessionId, languageType.value)

  //     popup({
  //       ...popupData,
  //       onClose: onSessionPopupClose
  //     })
  //   }

  //   const processByRoute = async (route: RouteLocationNormalized) => {
  //     if (route.name === 'AgendaDetail') {
  //       try {
  //         await popupSession(route.params.sessionId as string)
  //       } catch (error) {
  //         await router.replace({
  //           ...router.currentRoute,
  //           name: 'Agenda'
  //         })
  //       }
  //     } else if (route.name === 'Agenda') {
  //       closePopup()
  //     }
  //   }

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

  //   watch(() => dayIndex.value, () => {
  //     const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  //     const { cancel } = scrollTo({
  //       to: { left: 0, top: 0 },
  //       duration: isSafari ? 10 : undefined
  //     })
  //     const events = ['wheel', 'mousewheel', 'DOMMouseScroll']
  //     const onScrolling = () => {
  //       events.forEach((event) => window.removeEventListener(event, onScrolling))
  //       cancel()
  //     }
  //     events.forEach((event) => window.addEventListener(event, onScrolling))
  //   })

  //   watch(() => router.currentRoute.value, processByRoute)

  //   onMounted(async () => {
  //     setFullPageProgressStatus(true)
  //     await initAgenda()
  //     await processByRoute(router.currentRoute.value)
  //     setFullPageProgressStatus(false)
  //     await nextTick()
  //     registerSocket()
  //   })

  //   onBeforeUnmount(() => {
  //     unregisterSocket()
  //   })

  //   provide('languageType', languageType)
  //   provide('roomsStatus', roomsStatus)

  //   return {
  //     smAndUp,
  //     xsOnly,
  //     dayIndex,
  //     daysData,
  //     roomsStatus
  //   }
  // }
})
</script>
