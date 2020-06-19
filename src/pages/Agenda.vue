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
import { PopupManager, PopupContentType, PopupContainerType } from '../utils/popup'
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
    popupSession (sessionId = ''): void {
      injected(this).popupManager.popup({
        metaOptions: {
          title: 'Detail'
        },
        containerType: PopupContainerType.Default,
        contentData: {
          type: PopupContentType.General,
          html: `<h1>${sessionId}</h1>`
        },
        onClose: () => this.closeSessionPopup()
      })
    },
    closeSessionPopup (): void {
      this.$router.push({
        name: 'Agenda'
      })
    },
    processByRoute (route: Route): void {
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
