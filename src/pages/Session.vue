<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main id="session" class="page-container">
    <ScheduleNavbar />
    <SessionFilter />
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
import SessionFilter from '@/components/Session/SessionFilter.vue'

import '@/assets/scss/pages/session.scss'
import { usePopUp } from '@/modules/pop-up'
import { useRoute, useRouter } from 'vue-router'
import { generateSessionPopupData } from '@/modules/session/logic'
import { useI18n } from 'vue-i18n'
import { Locale } from '@/modules/i18n'
import { isClient } from '@vueuse/shared'
import communityData from '@/assets/json/community.json'
import { Session } from '@/modules/session/types'

export default defineComponent({
  name: 'Session',
  components: {
    ScheduleNavbar,
    ScheduleTable,
    ScheduleList,
    SessionFilter
  },
  setup () {
    const route = useRoute()
    const router = useRouter()
    const { load, daysSchedule, currentDayIndex, getSessionById, isLoaded } = useSession()
    const { openPopUp, removeAll } = usePopUp()
    const { xsOnly } = useBreakpoints()
    const { locale } = useI18n()

    function getCommunityFromSession (session: Session) {
      return communityData.communities.find((c) => c.track === session.type['zh-TW'].name)
    }

    function tryToOpenSessionPopUp () {
      const [bool, sessionId] = [isLoaded.value, route.params.sessionId as string]
      if (!bool) return
      if (typeof sessionId !== 'string') {
        removeAll((popUpData) => !popUpData.popupId?.startsWith('session-'))
        return
      }

      const onClose = () => {
        router.back()
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
            getCommunityFromSession(getSessionById(sessionId)),
            locale.value as Locale
          ),
          onClose
        })
      }
    }

    tryToOpenSessionPopUp()
    watch(() => [route.params.sessionId, isLoaded.value], () => {
      tryToOpenSessionPopUp()
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
      daysSchedule,
      load,
      tryToOpenSessionPopUp,
      route
    }
  },
  async serverPrefetch () {
    await this.load()
    if (this.route.params.sessionId) {
      this.tryToOpenSessionPopUp()
    }
  }
})
</script>
