<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main id="venue" class="page-container">
    <div class="authors">
      <a
      v-for="key in imageKeys"
      :key="key"
        :href="`#${key}`"
      >
        {{ key.split('.')[0].split('-').slice(1).join(' ') }}
      </a>
    </div>
    <div v-for="key in imageKeys" :key="key" class="map-container">
      <a :name="key" />
      <a :href="imagesMap[key]" target="_blank">
        <img :src="imagesMap[key]" :alt="`${key} Map`" />
      </a>
    </div>
    <a class="download" :href="mapFileUrl" :download="downloadText + '.pdf'">Download</a>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { generateAssetsMap } from '@/utils/common'
import '@/assets/scss/pages/venue.scss'
import mapFileUrl from '@/assets/map.pdf?url'

const imagesMap = generateAssetsMap(
  import.meta.globEager('../assets/images/venues/*.svg'),
  '../assets/images/venues/*.svg'
)

const imageKeys = Object.keys(imagesMap)
  .sort((a, b) => Number(a.split('-')[0]) - Number(b.split('-')[0]))

export default defineComponent({
  name: 'Venue',
  components: {
  },
  setup () {
    // const links = [
    //   'https://gather.town/app/yq99YWKCypHdDs0X/COSCUP%20Entrance',
    //   'https://gather.town/app/9JO8kCSwIqbd57jM/COSCUP%20Booth%201',
    //   'https://gather.town/app/PDC6hcsUH7aeEY21/COSCUP%20Booth%202'
    // ]

    // const linksImages = Object.fromEntries(links.map((k, index) => [maps[index], k]))

    const downloadText = `COSCUP ${import.meta.env.VITE_YEAR} Map`

    const { t } = useI18n()
    return {
      t,
      // maps,
      // linksImages,
      imageKeys,
      imagesMap,
      mapFileUrl,
      downloadText
    }
  }
})
</script>
