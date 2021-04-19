<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <nav v-if="isLoaded" class="schedule-navbar">
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
import { useSession } from '@/modules/session'

export default defineComponent({
  name: 'AgendaNavbar',
  setup () {
    const { isLoaded, currentDayIndex, daysSchedule } = useSession()
    const days = computed(() => daysSchedule.value.map(ds => ds.day))
    const selectedDay = computed(() => days.value[currentDayIndex.value])

    const onTabClick = (dayIndex: number) => {
      currentDayIndex.value = dayIndex
    }

    return {
      isLoaded,
      days,
      selectedDay,
      onTabClick
    }
  }
})
</script>
