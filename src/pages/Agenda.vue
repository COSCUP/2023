<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main
    id="agenda"
    class="page-container"
    :class="{
      popupped: popupService.isPopup
    }"
  >
    <AgendaNavbar />
    <AgendaTable v-show="breakpointService.smAndUp" />
    <AgendaList v-show="breakpointService.xsOnly" />
  </main>
</template>

<script lang="ts">
import Vue from 'vue'

import '@/assets/scss/pages/agenda.scss'
import { injectedThis } from '../utils/common'
import { LanguageService } from '../utils/language'
import { MetaService } from '../utils/meta'
import { PopupService, PopupData, PopupContainerType, PopupContentType } from '../utils/popup'
import { Route } from 'vue-router'
import { createAgendaService } from '@/utils/agenda'
import AgendaNavbar from '@/components/Agenda/AgendaNavbar.vue'
import AgendaTable from '@/components/Agenda/AgendaTable.vue'
import AgendaList from '@/components/Agenda/AgendaList.vue'
import { BreakpointService } from '../utils/breakpoint'

function injected (thisArg: unknown) {
  return injectedThis<{
    languageService: LanguageService;
    metaService: MetaService;
    popupService: PopupService;
    breakpointService: BreakpointService;
  }>(thisArg)
}

const agendaService = Vue.observable(createAgendaService([
  'AU',
  'TR209', 'TR211', 'TR212', 'TR213', 'TR214',
  'TR309', 'TR313',
  'TR409-2', 'TR410', 'TR411', 'TR412-1', 'TR412-2', 'TR413-1', 'TR413-2',
  'TR510', 'TR511'
]))

export default Vue.extend({
  name: 'Agenda',
  inject: ['languageService', 'metaService', 'popupService', 'breakpointService'],
  provide: {
    agendaService
  },
  components: {
    AgendaNavbar,
    AgendaTable,
    AgendaList
  },
  computed: {
    laugaugeType (): 'en' | 'zh' {
      if (injected(this).languageService.languageType === 'en') return 'en'
      else return 'zh'
    }
  },
  data () {
    return {
      dayIndex: 0
    }
  },
  methods: {
    async popupSession (sessionId = ''): Promise<void> {
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
        : await agendaService.getSessionPopupData(sessionId, this.laugaugeType)

      injected(this).popupService.popup({
        ...popupData,
        onClose: () => this.closeSessionPopup()
      })
    },
    closeSessionPopup (): void {
      this.$router.push({
        ...this.$route,
        name: 'Agenda'
      })
    },
    async processByRoute (route: Route): Promise<void> {
      if (route.name === 'AgendaDetail') {
        try {
          await this.popupSession(route.params.sessionId)
        } catch (error) {
          await this.$router.replace({
            ...this.$route,
            name: 'Agenda'
          })
        }
      }
    }
  },
  watch: {
    $route (to: Route): void {
      this.processByRoute(to)
    }
  },
  async mounted () {
    await this.processByRoute(this.$route)
    this.$emit('render')
  }
})
</script>
