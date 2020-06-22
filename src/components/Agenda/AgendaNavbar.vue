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
import Vue from 'vue'

export default Vue.extend({
  name: 'AgendaNavbar',
  inject: ['agendaService']
})
</script>

<style scoped>
</style>
