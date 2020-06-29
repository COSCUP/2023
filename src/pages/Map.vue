<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main id="map" class="page-container">
    Map
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

    onMounted(() => {
      dispatchRenderedEvent()
    })
  }
})
</script>
