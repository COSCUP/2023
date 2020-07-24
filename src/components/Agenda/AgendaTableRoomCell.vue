<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <div class="agenda-table-room-cell">
    <div class="status">
      <span class="bubble" :class="{ full: isFull }"></span>
      <span class="text">{{ statusText }}</span>
    </div>
    <span>Room</span>
    <span>{{ roomName }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ComputedRef, inject, computed } from '@vue/composition-api'
import { useAgendaService, useLanguageService } from '@/services/hooks'

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
    const roomsStatus = inject<ComputedRef<{ [k: string]: boolean }>>('roomsStatus') || { value: {} }
    const languageService = useLanguageService()
    const agendaService = useAgendaService()
    const room = computed(() => {
      const room = agendaService.getRoomById(props.roomId)
      if (room === null) throw new Error('Invalid Room')
      return room
    })
    const roomName = computed(() => room.value[languageType.value].name.split(' / ')[0])
    const isFull = computed(() => !!(roomsStatus.value[props.roomId]))
    const statusText = computed(() => languageService.languagePack.agenda['room-status'][isFull.value ? 'full' : 'vacancy'])

    return {
      roomName,
      isFull,
      statusText
    }
  }
})
</script>
