<template>
  <main
    id="agenda"
    class="page-container"
    :class="{
      popupped: popupManager.isPopup
    }"
  >
    <AgendaNavbar />
    <AgendaTable v-show="breakpointManager.smAndUp" />
    <AgendaList v-show="breakpointManager.xsOnly" />
  </main>
</template>

<script lang="ts">
import Vue from 'vue'

import '@/assets/scss/pages/agenda.scss'
import { injectedThis } from '../utils/common'
import { LanguageManager } from '../utils/language'
import { MetaManager } from '../utils/meta'
import { PopupManager, PopupContentType, PopupContainerType } from '../utils/popup'
import { Route } from 'vue-router'
import { createAgendaService } from '@/utils/agenda'
import AgendaNavbar from '@/components/Agenda/AgendaNavbar.vue'
import AgendaTable from '@/components/Agenda/AgendaTable.vue'
import AgendaList from '@/components/Agenda/AgendaList.vue'
import { BreakpointManager } from '../utils/breakpoint'

function injected (thisArg: unknown) {
  return injectedThis<{
    languageManager: LanguageManager;
    metaManager: MetaManager;
    popupManager: PopupManager;
    breakpointManager: BreakpointManager;
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
  inject: ['languageManager', 'metaManager', 'popupManager', 'breakpointManager'],
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
      if (injected(this).languageManager.languageType === 'en') return 'en'
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
      const popupData = await agendaService.getSessionPopupData(sessionId, this.laugaugeType)

      injected(this).popupManager.popup({
        ...popupData,
        onClose: () => this.closeSessionPopup()
      })
    },
    closeSessionPopup (): void {
      this.$router.push({
        name: 'Agenda'
      })
    },
    async processByRoute (route: Route): Promise<void> {
      if (route.name === 'AgendaDetail') {
        this.popupSession(route.params.sessionId)
      }
    }
  },
  watch: {
    $route (to: Route): void {
      this.processByRoute(to)
    }
  },
  mounted () {
    this.processByRoute(this.$route)
    this.$emit('render')
  }
})
</script>
