<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <table class="schedule-table">
    <thead class="room-list">
      <tr>
        <th v-for="cell in table.head" :key="`table-room-${cell.room}`">
          <div class="cell-content">
            <ScheduleTableRoomCell :room-id="cell.room"></ScheduleTableRoomCell>
          </div>
        </th>
      </tr>
    </thead>
    <div style="height: 0.5rem;"></div>
    <tbody class="table-body">
      <tr v-for="(row, rowIndex) in table.body" :key="`table-row-${rowIndex}`">
        <td
          v-for="(cell, index) in row"
          :key="`table-row-${rowIndex}-cell-${index}`"
          :rowspan="cell.rowspan"
        >
          <div class="cell-content">
            <ScheduleItem v-if="cell.type === 'session'" :session-id="cell.element.session"></ScheduleItem>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { ScheduleTable } from '@/modules/session/types'
import { defineComponent, PropType } from 'vue'
import ScheduleItem from './ScheduleItem.vue'
import ScheduleTableRoomCell from './ScheduleTableRoomCell.vue'

export default defineComponent({
  name: 'ScheduleTable',
  components: {
    ScheduleItem,
    ScheduleTableRoomCell
  },
  props: {
    table: {
      type: Object as PropType<ScheduleTable>,
      required: true
    }
  }
  // setup (props) {
  //   const router = useRouter()
  //   const tableStyle = computed(() => ({ '--table-column': props.table.rooms.length }))
  //   const getSessionLocation = (sessionId: string) => ({
  //     name: 'AgendaDetail',
  //     params: {
  //       ...router.currentRoute.value.params,
  //       sessionId
  //     }
  //   })

  //   return {
  //     languageType,
  //     tableStyle,
  //     getSessionLocation
  //   }
  // }
})
</script>
