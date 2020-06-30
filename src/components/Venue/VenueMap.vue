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
import { defineComponent, ref, watch, onMounted, onBeforeUnmount } from '@vue/composition-api'
import { createMap, Map, MapOptions } from '@/utils/map'
import { useRouter } from '@/router'

export default defineComponent({
  name: 'VenueMap',
  props: {
    options: {
      type: Object,
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
  setup (props) {
    const router = useRouter()
    const mapInstance = ref<Map | null>(null)

    watch(() => router.currentRoute, (to) => {
      if (to.name === 'Venue') {
        mapInstance.value === null && (mapInstance.value = createMap(props.options))
        mapInstance.value && mapInstance.value.resetView()
      }
    })

    onMounted(() => {
      mapInstance.value = createMap(props.options)
    })

    onBeforeUnmount(() => {
      mapInstance.value !== null && mapInstance.value.destroy()
      mapInstance.value = null
    })

    return {
      mapInstance
    }
  }
})
</script>

<style scoped>
</style>
