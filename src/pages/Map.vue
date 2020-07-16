<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main
    id="map"
    class="page-container"
  >
    <div
      v-for="map in maps"
      :key="map"
      class="map-container"
    >
      <img
        :src="`/2020/images/maps/${map}.png`"
        alt="Map"
      >
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api'

import '@/assets/scss/pages/map.scss'
import { useRenderedEventDispatcher } from '@/plugins/renderedEventDispatcher'

export default defineComponent({
  name: 'Map',
  components: {
  },
  setup () {
    const dispatchRenderedEvent = useRenderedEventDispatcher()
    const maps = ['map-all', 'map-tr-2f', 'map-tr-3f', 'map-tr-4f', 'map-tr-5f']
    onMounted(() => {
      dispatchRenderedEvent()
    })

    return {
      maps
    }
  }
})
</script>
