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
import { useAgendaService } from '@/services/hooks'

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
