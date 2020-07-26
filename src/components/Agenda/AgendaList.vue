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
import { defineComponent } from '@vue/composition-api'
import { formatTimeString } from '@/services/agenda'
import AgendaSessionItem from '@/components/Agenda/AgendaSessionItem.vue'

export default defineComponent({
  name: 'AgendaList',
  components: {
    AgendaSessionItem
  },
  props: {
    list: {
      type: Object,
      required: true
    }
  },
  setup () {
    return {
      formatTimeString
    }
  }
})
</script>
