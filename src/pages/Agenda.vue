<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main id="agenda" class="page-container">
    <AgendaNavbar />
    <AgendaTable v-show="breakpointService.smAndUp" />
    <AgendaList v-show="breakpointService.xsOnly" />
  </main>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, watch, onMounted, provide } from '@vue/composition-api'
import { Route } from 'vue-router'
import { useRouter } from '@/router'
import { createAgendaService } from '@/services/agenda'
import { useLanguageService, usePopupService, useBreakpointService } from '@/services/hooks'
import { PopupData, PopupContainerType, PopupContentType } from '@/services/popup'
import { useRenderedEventDispatcher } from '@/plugins/renderedEventDispatcher'
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
    const languageService = useLanguageService()
    const popupService = usePopupService()
    const breakpointService = useBreakpointService()
    const agendaService = reactive(createAgendaService([
      'RB105',
      'AU',
      'TR209', 'TR211', 'TR212', 'TR213', 'TR214',
      'TR309', 'TR310-2', 'TR311', 'TR313',
      'TR409-2', 'TR410', 'TR411', 'TR412-1', 'TR412-2', 'TR413-1', 'TR413-2'
    ]))
    const languageType = computed(() => languageService.languageType === 'zh-TW' ? 'zh' : languageService.languageType)

    const closeSessionPopup = () => {
      router.push({
        ...router.currentRoute,
        name: 'Agenda'
      })
    }

    const popupSession = async (sessionId = '') => {
      const popupData: PopupData = sessionId === 'template'
        ? {
          popupId: 'session-template',
          metaOptions: {
            title: 'Template'
          },
          containerType: PopupContainerType.Default,
          contentData: {
            type: PopupContentType.General,
            html: '<article id="session-detail" class="session-detail"><h1>Session Popup Template</h1></article>'
          }
        }
        : await agendaService.getSessionPopupData(sessionId, languageType.value)

      popupService.popup({
        ...popupData,
        onClose: () => closeSessionPopup()
      })
    }

    const processByRoute = async (route: Route) => {
      if (route.name === 'AgendaDetail') {
        try {
          await popupSession(route.params.sessionId)
        } catch (error) {
          await router.replace({
            ...router.currentRoute,
            name: 'Agenda'
          })
        }
      }
    }

    watch(() => router.currentRoute, (to) => {
      processByRoute(to)
    })

    onMounted(async () => {
      await processByRoute(router.currentRoute)
      dispatchRenderedEvent()
    })

    provide('agendaService', agendaService)
    provide('languageType', languageType)

    return {
      breakpointService
    }
  }
})
</script>
