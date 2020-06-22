<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <section></section>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { createMap, Map, MapOptions } from '@/utils/map'

export default Vue.extend({
  name: 'Map',
  props: {
    options: {
      type: Object as PropType<MapOptions>,
      required: true,
      validator (value: MapOptions): boolean {
        const rules = [
          () => value.center instanceof Object && typeof value.center.lng === 'number' && typeof value.center.lat === 'number',
          () => typeof value.zoom === 'number' && value.zoom > 0
        ]
        return rules.every((rule) => rule())
      }
    }
  },
  data () {
    return {
      mapInstance: null as Map | null
    }
  },
  async mounted () {
    this.mapInstance !== null && this.mapInstance.destroy()
    this.mapInstance = createMap(this.options)
  },
  beforeDestroy () {
    this.mapInstance !== null && this.mapInstance.destroy()
  }
})
</script>

<style scoped>
</style>
