<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main id="venue" class="page-container">
    <div v-for="map in maps" :key="map" class="map-container">
      <img :src="mapImages[map]" alt="Map" />
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { generateAssetsMap } from '@/utils/common'
import '@/assets/scss/pages/venue.scss'

const imagesMap = generateAssetsMap(
  import.meta.globEager('../assets/images/venues/*.png'),
  '../assets/images/venues/*.png'
)

export default defineComponent({
  name: 'Venue',
  components: {
  },
  setup () {
    const maps = ['map-all', 'map-tr-2f', 'map-tr-3f', 'map-tr-4f', 'map-tr-5f']
    const mapImages = Object.fromEntries(maps.map(k => [k, imagesMap[`${k}.png`]]))

    return {
      maps,
      mapImages
    }
  }
})
</script>
