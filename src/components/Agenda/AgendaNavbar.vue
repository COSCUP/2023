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
        :class="{ active: selectedDay.join('') === day.join('') }"
        v-for="(day, index) in days"
        :key="`day-option-${index}`"
        @click="onTabClick(index)"
      >
        <span class="day-text">{{ `Day ${index + 1}` }}</span>
        <span class="date">{{ day.join(" / ") }}</span>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useAgendaService } from '@/services/hooks'

export default defineComponent({
  name: 'AgendaNavbar',
  props: {
    modelValue: {
      type: Number,
      required: true
    }
  },
  setup (props, context) {
    const agendaService = useAgendaService()

    const days = computed(() => agendaService.days)
    const selectedDay = computed(() => days.value[props.modelValue])

    const onTabClick = (dayIndex: number) => {
      context.emit('update:modelValue', dayIndex)
    }

    return {
      days,
      selectedDay,
      onTabClick
    }
  }
})
</script>

<style scoped>
</style>
