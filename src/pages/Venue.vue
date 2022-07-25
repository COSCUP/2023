<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main id="venue" class="page-container">
    <div v-for="map in maps" :key="map" class="map-container">
      <!-- <h2 class="title">
        <a :href="linksImages[map]" target="_blank">
          {{ t(`home.info.${map}`)}}
        </a>
      </h2> -->
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
    const maps = ['map-all', 'map-2F', 'map-3F', 'map-4F', 'map-5F']
    // const links = [
    //   'https://gather.town/app/yq99YWKCypHdDs0X/COSCUP%20Entrance',
    //   'https://gather.town/app/9JO8kCSwIqbd57jM/COSCUP%20Booth%201',
    //   'https://gather.town/app/PDC6hcsUH7aeEY21/COSCUP%20Booth%202'
    // ]
    const mapImages = Object.fromEntries(maps.map(k => [k, imagesMap[`${k}.jpg`]]))
    // const linksImages = Object.fromEntries(links.map((k, index) => [maps[index], k]))

    const { t } = useI18n()
    return {
      t,
      maps,
      // linksImages,
      mapImages
    }
  }
})
</script>
