<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main id="venue" class="page-container">
    <div v-for="map in maps" :key="map" class="map-container">
      <h2 class="title">
        {{ t(`home.info.${map}`)}}
      </h2>
      <img :src="mapImages[map]" alt="Map" />
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { generateAssetsMap } from '@/utils/common'
import '@/assets/scss/pages/venue.scss'

const imagesMap = generateAssetsMap(
  import.meta.globEager('../assets/images/venues/*.jpg'),
  '../assets/images/venues/*.jpg'
)

export default defineComponent({
  name: 'Venue',
  components: {
  },
  setup () {
    const maps = ['entrance', 'booth_1', 'booth_2']
    const mapImages = Object.fromEntries(maps.map(k => [k, imagesMap[`${k}.jpg`]]))
    const { t } = useI18n()
    return {
      t,
      maps,
      mapImages
    }
  }
})
</script>
