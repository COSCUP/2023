<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <ul class="schedule-list">
    <section
      v-for="(section, i) in list.items"
      :key="`schedule-list-section-${i.toString()}`"
      class="section"
    >
      <li class="time">
        {{ getTimeText(section.start) }}
      </li>
      <li
        v-for="{ session: sessionId } in section.elements"
        :key="`schedule-list-section-${i.toString()}-session-${sessionId}`"
        class="schedule-item-container"
      >
        <ScheduleItem :session-id="sessionId"></ScheduleItem>
      </li>
    </section>
  </ul>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { HourOfDate, MinuteOfDate, ScheduleList, SessionsMap } from '@/modules/session/types'
import { padNumberStart2WithZero } from '@/modules/session/utils'
import ScheduleItem from './ScheduleItem.vue'

export default defineComponent({
  name: 'ScheduleList',
  components: {
    ScheduleItem
  },
  props: {
    list: {
      type: Object as PropType<ScheduleList>,
      required: true
    },
    sessionsMap: {
      type: Object as PropType<SessionsMap>,
      rquired: true
    }
  },
  setup () {
    const getTimeText = ([hour, minute]: [HourOfDate, MinuteOfDate]) => {
      return `${padNumberStart2WithZero(hour)}：${padNumberStart2WithZero(minute)}`
    }

    return {
      getTimeText
    }
  }
})
</script>
