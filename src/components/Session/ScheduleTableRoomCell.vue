<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <div v-if="isLoaded" class="schedule-table-room-cell">
    <div class="status">
      <span class="bubble" :class="{ full: isFull }"></span>
      <span class="text">{{ statusText }}</span>
    </div>
    <span>Room</span>
    <span>{{ roomName }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSession } from '@/modules/session'
import { Locale } from '@/modules/i18n'

export default defineComponent({
  name: 'AgendaTableRoomCell',
  props: {
    roomId: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { t, locale } = useI18n()
    const { isLoaded, getRoomById, getRoomStatusById } = useSession()
    const roomName = computed(() => getRoomById(props.roomId)[locale.value as Locale].name.split(' / ')[0])
    const status = computed(() => getRoomStatusById(props.roomId))
    const isFull = computed(() => status.value.isFull)
    const statusText = computed(() => t(`session['room-status'].${isFull.value ? 'full' : 'vacancy'}`))

    return {
      isLoaded,
      roomName,
      isFull,
      statusText
    }
  }
})
</script>
