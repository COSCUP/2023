<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <ul class="agenda-list">
    <section
      v-for="(section, i) in list.sections"
      :key="`agenda-list-section-${i}`"
      class="section"
    >
      <li class="time">
        {{ formatTimeString(section.start, "：") }}
      </li>
      <li
        v-for="sessionId in section.sessions"
        :key="`agenda-list-section-${i}-session-${sessionId}`"
        class="session-item-container"
      >
        <AgendaSessionItem :session-id="sessionId"></AgendaSessionItem>
      </li>
    </section>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue'
import { injectedThis } from '@/utils/common'
import { LanguageService } from '@/services/language'
import { AgendaService, formatTimeString } from '@/services/agenda'
import AgendaSessionItem from '@/components/Agenda/AgendaSessionItem.vue'

function injected (thisArg: unknown) {
  return injectedThis<{
    languageService: LanguageService;
    agendaService: AgendaService;
  }>(thisArg)
}

export default Vue.extend({
  name: 'AgendaList',
  inject: ['languageService', 'agendaService'],
  components: {
    AgendaSessionItem
  },
  computed: {
    list () {
      return injected(this).agendaService.list
    }
  },
  data () {
    return {
    }
  },
  methods: {
    formatTimeString
  }
})
</script>

<style scoped>
</style>
