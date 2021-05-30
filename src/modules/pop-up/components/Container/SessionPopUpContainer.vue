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
      v-if="news"
      class="sponsor-news vertical"
      :href="news.verticalLeft.link"
      target="_blank"
      rel="noopener noreferrer"
    >
      <!-- <img
        :src="imagesMap[`${news.verticalLeft.sponsor}/vertical.png`]"
        :alt="`${news.verticalLeft.sponsor}'s news`"
      /> -->
      <img
        :src="news.verticalLeft.image.vertical"
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
      v-if="news"
      class="sponsor-news horizontal"
      :href="news.horizontalBottom.link"
      target="_blank"
      rel="noopener noreferrer"
    >
      <!-- <img
        :src="imagesMap[`${news.horizontalBottom.sponsor}/horizontal.png`]"
        :alt="`${news.horizontalBottom.sponsor}'s news`"
      /> -->
      <img
        :src="news.horizontalBottom.image.horizontal"
        :alt="`${news.horizontalBottom.sponsor}'s news`"
      />
    </a>
    <a
      v-if="news"
      class="sponsor-news vertical"
      :href="news.verticalRight.link"
      target="_blank"
      rel="noopener noreferrer"
    >
      <!-- <img
        :src="imagesMap[`${news.verticalRight.sponsor}/vertical.png`]"
        :alt="`${news.verticalRight.sponsor}'s news`"
      /> -->
      <img
        :src="news.verticalRight.image.vertical"
        :alt="`${news.verticalRight.sponsor}'s news`"
      />
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue'
import sponsorNewsData from '@/assets/json/sponsor-news.json'
// import { generateAssetsMap } from '@/utils/common'

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];
type NewsData = ArrayElement<typeof sponsorNewsData>

interface NewsList {
  verticalLeft: NewsData;
  verticalRight: NewsData;
  horizontalBottom: NewsData;
}

// const imagesMap = generateAssetsMap(
//   import.meta.globEager('../../../../assets/images/sponsor-news/*/*.png'),
//   '../../../../assets/images/sponsor-news/*/*.png'
// )

const { randomOnce } = (() => {
  if (sponsorNewsData.length === 0) {
    return {
      randomOnce () { return null }
    }
  }

  const indexStringLength = sponsorNewsData.length.toString(16).length
  const randomString = sponsorNewsData
    .map((data, i) => {
      return i.toString(16)
        .padStart(indexStringLength, '0')
        .repeat(data.weight)
    })
    .join('')
  function randomNews (): NewsData {
    const random = Math.floor(Math.random() * (randomString.length / indexStringLength))
    const result = Number('0x' + randomString.slice(random * indexStringLength, (random + 1) * indexStringLength))
    return sponsorNewsData[result]
  }

  function randomOnce () {
    const result: Partial<NewsList> = {
      horizontalBottom: randomNews()
    }
    if (Math.random() < 0.3) {
      const level = Math.random() < 0.6 ? 'titanium' : 'diamond'
      const sponsor = (sponsorNewsData
        .filter((data) => data.level === level)
        .sort(() => 0.5 - Math.random())
        .pop() ?? sponsorNewsData[0]).sponsor
      const datas = sponsorNewsData
        .filter((data) => data.sponsor === sponsor)
        .sort(() => 0.5 - Math.random())
      switch (datas.length) {
        case 0:
        case 1:
          result.verticalLeft = datas[0]
          result.verticalRight = datas[0]
          break

        default:
          result.verticalLeft = datas[0]
          result.verticalRight = datas[1]
          break
      }
    } else {
      result.verticalLeft = randomNews()
      result.verticalRight = randomNews()
    }

    return result as NewsList
  }

  return {
    randomOnce
  }
})()

export default defineComponent({
  name: 'SessionPopupContainer',
  setup () {
    const news = ref<NewsList | null>(null)

    onBeforeMount(() => {
      news.value = randomOnce()
    })

    return {
      // imagesMap,
      news
    }
  }
})
</script>
