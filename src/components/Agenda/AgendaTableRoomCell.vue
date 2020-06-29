<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <div class="agenda-table-room-cell">
    <span>Room</span>
    <span>{{ roomName }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ComputedRef, inject, computed } from '@vue/composition-api'
import { useAgendaService } from '@/services/agenda'

export default defineComponent({
  name: 'AgendaTableRoomCell',
  props: {
    roomId: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const languageType = inject<ComputedRef<'zh' | 'en'>>('languageType') || { value: 'zh' }
    const agendaService = useAgendaService()
    const room = computed(() => {
      const room = agendaService.getRoomById(props.roomId)
      if (room === null) throw new Error('Invalid Room')
      return room
    })
    const roomName = computed(() => room.value[languageType.value].name.split(' / ')[0])

    return {
      roomName
    }
  }
})
</script>

<!--script lang="ts">
import Vue from 'vue'
import { AgendaService, Room } from '@/services/agenda'
import { LanguageService } from '@/services/language'
import { injectedThis } from '@/utils/common'

function injected (thisArg: unknown) {
  return injectedThis<{
    languageService: LanguageService;
    agendaService: AgendaService;
  }>(thisArg)
}

export default Vue.extend({
  name: 'AgendaTableRoomCell',
  inject: ['languageService', 'agendaService'],
  props: {
    roomId: {
      type: String,
      required: true
    }
  },
  computed: {
    laugaugeType (): 'en' | 'zh' {
      if (injected(this).languageService.languageType === 'en') return 'en'
      else return 'zh'
    },
    room (): Room {
      const room = injected(this).agendaService.getRoomById(this.roomId)
      if (room === null) throw new Error('Invalid Room')
      return room
    },
    roomName (): string {
      return this.room[this.laugaugeType].name.split(' / ')[0]
    }
  }
})
</script-->
