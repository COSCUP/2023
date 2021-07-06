<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <div v-if="isLoaded" class="schedule-table-room-cell">
    <div class="live">
      <iframe
        v-if="iframeLoaded"
        width="240"
        height="135"
        :src="`${roomLink}&autoplay=1`"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>

      <div v-else class="play-container" @click="iframeLoaded = true">
        <icon-mdi-play></icon-mdi-play>
      </div>
    </div>

    <div class="text">
      <span>Room</span>
      <span>{{ roomName }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSession } from '@/modules/session'
import { Locale } from '@/modules/i18n'
import ytLinkDatas from '@/assets/json/ytLink.json'

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
    const roomLink = computed(() => {
      const videoId = ytLinkDatas[props.roomId as keyof typeof ytLinkDatas]
      const url = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`)
      url.searchParams.set('autoplay', '1')
      url.searchParams.set('modestbranding', '1')
      url.searchParams.set('controls', '0')
      url.searchParams.set('rel', '0')

      return url.toString()
    })
    const iframeLoaded = ref(false)

    return {
      isLoaded,
      roomName,
      isFull,
      statusText,
      roomLink,
      iframeLoaded
    }
  }
})
</script>
