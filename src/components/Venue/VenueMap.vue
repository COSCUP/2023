<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <section class="map">
    <div class="reset-view-btn-container">
      <button
        class="reset-view-btn"
        @click="mapInstance && mapInstance.resetView()"
      >
        <Icon name="redo" />
      </button>
    </div>
  </section>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Route } from 'vue-router'
import { createMap, Map, MapOptions } from '@/utils/map'

export default Vue.extend({
  name: 'VenueMap',
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
  watch: {
    '$route' (to: Route) {
      if (to.name === 'Venue') {
        this.mapInstance === null && (this.mapInstance = createMap(this.options))
        this.mapInstance && this.mapInstance.resetView()
      }
    }
  },
  mounted () {
    this.mapInstance = createMap(this.options)
  },
  beforeDestroy () {
    this.mapInstance !== null && this.mapInstance.destroy()
    this.mapInstance = null
  }
})
</script>

<style scoped>
</style>
