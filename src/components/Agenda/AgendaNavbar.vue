<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <nav class="agenda-navbar">
    <div class="tabs">
      <div
        class="tab"
        :class="{ active: agendaService.day.join('') === day.join('') }"
        v-for="(day, index) in agendaService.days"
        :key="`day-option-${index}`"
        @click="agendaService.dayIndex = index"
      >
        <span class="day-text">{{ `Day ${index + 1}` }}</span>
        <span class="date">{{ day.join(" / ") }}</span>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { useAgendaService } from '@/services/hooks'

export default defineComponent({
  name: 'AgendaNavbar',
  setup () {
    const agendaService = useAgendaService()

    return {
      agendaService
    }
  }
})
</script>

<style scoped>
</style>
