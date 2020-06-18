<template>
  <main id="agenda" class="page-container">
    <router-link
      :to="{
        name: 'AgendaDetail',
        params: {
          sessionId: 'asdasd'
        }
      }"
    >
      Agenda
    </router-link>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'

import '@/assets/scss/pages/agenda.scss'
import { injectedThis } from '../utils/common'
import { LanguageManager } from '../utils/language'
import { MetaManager } from '../utils/meta'
import { PopupManager, PopupContentType } from '../utils/popup'
import { Route } from 'vue-router'

function injected (thisArg: unknown) {
  return injectedThis<{
    languageManager: LanguageManager;
    metaManager: MetaManager;
    popupManager: PopupManager;
  }>(thisArg)
}

export default Vue.extend({
  name: 'Agenda',
  inject: ['languageManager', 'metaManager', 'popupManager'],
  components: {
  },
  methods: {
    updateSessionMeta () {
      if (this.$route.name === 'AgendaDetail') {
        injected(this).metaManager.resetMeta()
        injected(this).metaManager.setMeta({
          title: 'Detail'
        })
      }
    },
    popupSession (sessionId = ''): void {
      injected(this).popupManager.popupContentData = {
        type: PopupContentType.General,
        html: `<h1>${sessionId}</h1>`
      }
    },
    closeSessionPopup (): void {
      this.$router.push({
        name: 'Agenda'
      })
    },
    processByRoute (route: Route): void {
      if (route.name === 'AgendaDetail') {
        this.updateSessionMeta()
        this.popupSession(route.params.sessionId)
      }
    }
  },
  watch: {
    $route (to: Route): void {
      this.processByRoute(to)
    },
    'popupManager.isPopup' (isPopup: boolean) {
      if (!isPopup) {
        this.closeSessionPopup()
      }
    }
  },
  mounted () {
    this.processByRoute(this.$route)
  }
})
</script>
