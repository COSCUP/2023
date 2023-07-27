<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main id="guide" class="page-container">
    <section>
      <a name="main" />
      <div v-for="key in Object.keys(mainImages[imageType])" :key="key" class="guide-container">
        <a :href="mainImages[imageType][key]" target="_blank">
          <img :src="mainImages[imageType][key]" />
        </a>
      </div>
    </section>
    <section>
      <a name="opass" />
      <div v-for="key in Object.keys(opassImages[imageType])" :key="key" class="guide-container">
        <a :href="opassImages[imageType][key]" target="_blank">
          <img :src="opassImages[imageType][key]" />
        </a>
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { generateAssetsMap } from '@/utils/common'
import '@/assets/scss/pages/guide.scss'

const mainImages = {
  en: generateAssetsMap(
    import.meta.globEager('../assets/images/guide/main/en/*.jpg'),
    '../assets/images/guide/main/en/*.jpg'
  ),
  zh: generateAssetsMap(
    import.meta.globEager('../assets/images/guide/main/zh/*.jpg'),
    '../assets/images/guide/main/zh/*.jpg'
  )
}

const opassImages = {
  en: generateAssetsMap(
    import.meta.globEager('../assets/images/guide/opass/en/*.jpg'),
    '../assets/images/guide/opass/en/*.jpg'
  ),
  zh: generateAssetsMap(
    import.meta.globEager('../assets/images/guide/opass/zh/*.jpg'),
    '../assets/images/guide/opass/zh/*.jpg'
  )
}

export default defineComponent({
  name: 'Guide',
  components: {
  },
  setup () {
    const { t, locale } = useI18n()

    console.log(mainImages)

    const imageType = computed(() => locale.value !== 'en' ? 'zh' : 'en')

    return {
      t,
      imageType,
      mainImages,
      opassImages
    }
  }
})
</script>
