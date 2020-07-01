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
import { defineComponent, computed } from '@vue/composition-api'
import { formatTimeString } from '@/services/agenda'
import { useAgendaService } from '@/services/hooks'
import AgendaSessionItem from '@/components/Agenda/AgendaSessionItem.vue'

export default defineComponent({
  name: 'AgendaList',
  components: {
    AgendaSessionItem
  },
  setup () {
    const agendaService = useAgendaService()
    const list = computed(() => agendaService.list)

    return {
      list,
      formatTimeString
    }
  }
})
</script>

<!--script lang="ts">
import Vue from 'vue'
import AgendaSessionItem from '@/components/Agenda/AgendaSessionItem.vue'
import { AgendaService, formatTimeString } from '@/services/agenda'
import { LanguageService } from '@/services/language'
import { injectedThis } from '@/utils/common'

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

<style-- scoped>
</style-->
