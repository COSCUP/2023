<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <div
    id="session-popup-container"
    class="popup-container"
    @click.self="$emit('close')"
  >
    <a
      v-if="news.verticalLeft"
      class="sponsor-news vertical"
      :href="news.verticalLeft.link"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        :data-src="imagesMap[`${news.verticalLeft.sponsor}/vertical.png`]"
        :src="imagesMap[`${news.verticalLeft.sponsor}/vertical.png`]"
        :alt="`${news.verticalLeft.sponsor}'s news`"
      />
    </a>
    <div class="inner-container">
      <button class="close" @click="$emit('close')">
        <icon-fa-solid-times/>
      </button>
      <slot></slot>
    </div>
    <a
      v-if="news.horizontalBottom"
      class="sponsor-news horizontal"
      :href="news.horizontalBottom.link"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        :src="imagesMap[`${news.horizontalBottom.sponsor}/horizontal.png`]"
        :alt="`${news.horizontalBottom.sponsor}'s news`"
      />
    </a>
    <a
      v-if="news.verticalRight"
      class="sponsor-news vertical"
      :href="news.verticalRight.link"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        :src="imagesMap[`${news.verticalRight.sponsor}/vertical.png`]"
        :alt="`${news.verticalRight.sponsor}'s news`"
      />
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, reactive } from 'vue'
import sponsorNewsData from '@/assets/json/sponsor-news.json'
import { generateAssetsMap } from '@/utils/common'

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];
type NewsData = ArrayElement<typeof sponsorNewsData>

interface NewsList {
  verticalLeft: NewsData | null;
  verticalRight: NewsData | null;
  horizontalBottom: NewsData | null;
}

const imagesMap = generateAssetsMap(
  import.meta.globEager('../../../../assets/images/sponsor-news/*/*.png'),
  '../../../../assets/images/sponsor-news/*/*.png'
)

export default defineComponent({
  name: 'SessionPopupContainer',
  setup () {
    const news: NewsList = reactive({
      verticalLeft: null,
      verticalRight: null,
      horizontalBottom: null
    })

    onBeforeMount(() => {
      const numOfAds = sponsorNewsData.length
      news.verticalLeft = sponsorNewsData[Math.floor(Math.random() * numOfAds)]
      news.verticalRight = sponsorNewsData[Math.floor(Math.random() * numOfAds)]
      news.horizontalBottom = sponsorNewsData[Math.floor(Math.random() * numOfAds)]
    })

    return {
      news,
      imagesMap
    }
  }
})
</script>
