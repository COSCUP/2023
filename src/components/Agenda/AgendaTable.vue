<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <table class="agenda-table" :style="tableStyle">
    <thead class="room-list">
      <tr>
        <th v-for="(room, index) in table.rooms" :key="`table-room-${index}`">
          <div class="cell-content">
            <AgendaTableRoomCell :room-id="room"> </AgendaTableRoomCell>
          </div>
        </th>
      </tr>
    </thead>
    <div style="height: 0.5rem;"></div>
    <tbody class="table-body">
      <tr v-for="(row, rowIndex) in table.rows" :key="`table-row-${rowIndex}`">
        <td
          v-for="(cell, index) in row"
          :key="`table-row-${rowIndex}-cell-${index}`"
          :rowspan="cell.rowSpan"
        >
          <div
            class="cell-content"
            :class="{
              blank: cell.type === TableCellType.Blank
            }"
          >
            <AgendaSessionItem
              v-if="cell.type !== TableCellType.Blank"
              :session-id="cell.sessionId"
            >
            </AgendaSessionItem>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent, inject, computed } from '@vue/composition-api'
import { useAgendaService, TableCellType } from '@/services/agenda'
import AgendaSessionItem from './AgendaSessionItem.vue'
import AgendaTableRoomCell from './AgendaTableRoomCell.vue'
import { useRouter } from '@/router'

export default defineComponent({
  name: 'AgendaTable',
  components: {
    AgendaTableRoomCell,
    AgendaSessionItem
  },
  setup () {
    const router = useRouter()
    const agendaService = useAgendaService()
    const languageType = inject<'zh' | 'en'>('languageType') || 'zh'
    const table = computed(() => agendaService.table)
    const tableStyle = computed(() => ({ '--table-column': agendaService.table.rooms.length }))
    const getSessionLocation = (sessionId: string) => ({
      name: 'AgendaDetail',
      params: {
        ...router.currentRoute.params,
        sessionId
      }
    })

    return {
      TableCellType,
      languageType,
      table,
      tableStyle,
      getSessionLocation
    }
  }
})
</script>

<!--script lang="ts">
import Vue from 'vue'
import { Location } from 'vue-router'
import AgendaSessionItem from './AgendaSessionItem.vue'
import AgendaTableRoomCell from './AgendaTableRoomCell.vue'
import { AgendaService, TableCellType } from '@/services/agenda'
import { LanguageService } from '@/services/language'
import { injectedThis } from '@/utils/common'

function injected (thisArg: unknown) {
  return injectedThis<{
    languageService: LanguageService;
    agendaService: AgendaService;
  }>(thisArg)
}

export default Vue.extend({
  name: 'AgendaTable',
  inject: ['languageService', 'agendaService'],
  components: {
    AgendaTableRoomCell,
    AgendaSessionItem
  },
  computed: {
    table () {
      return injected(this).agendaService.table
    },
    tableStyle () {
      return {
        '--table-column': injected(this).agendaService.table.rooms.length
      }
    }
  },
  data () {
    return {
      TableCellType
    }
  },
  methods: {
    getSessionLocation (sessionId: string): Location {
      return {
        name: 'AgendaDetail',
        params: {
          ...this.$route.params,
          sessionId
        }
      }
    }
  }
})
</script-->
