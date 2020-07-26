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
      v-if="ads.horizontalTop"
      class="sponsor-ad horizontal"
      :href="ads.horizontalTop.link"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        :src="`/2020/images/sponsor-ads/${ads.horizontalTop.sponsor}/horizontal.png`"
        :alt="`${ads.horizontalTop.sponsor}'s AD`"
      />
    </a>
    <a
      v-if="ads.verticalLeft"
      class="sponsor-ad vertical"
      :href="ads.verticalLeft.link"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        :src="`/2020/images/sponsor-ads/${ads.verticalLeft.sponsor}/vertical.png`"
        :alt="`${ads.verticalLeft.sponsor}'s AD`"
      />
    </a>
    <div class="inner-container">
      <button class="close" @click="$emit('close')">
        <Icon name="times"></Icon>
      </button>
      <slot></slot>
    </div>
    <a
      v-if="ads.horizontalBottom"
      class="sponsor-ad horizontal"
      :href="ads.horizontalBottom.link"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        :src="`/2020/images/sponsor-ads/${ads.horizontalBottom.sponsor}/horizontal.png`"
        :alt="`${ads.horizontalBottom.sponsor}'s AD`"
      />
    </a>
    <a
      v-if="ads.verticalRight"
      class="sponsor-ad vertical"
      :href="ads.verticalRight.link"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        :src="`/2020/images/sponsor-ads/${ads.verticalRight.sponsor}/vertical.png`"
        :alt="`${ads.verticalRight.sponsor}'s AD`"
      />
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, reactive } from '@vue/composition-api'
import sponsorAdsData from '@/../public/json/sponsor-ads.json'

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];
type AdData = ArrayElement<typeof sponsorAdsData.ads>

interface AdList {
  verticalLeft: AdData | null;
  verticalRight: AdData | null;
  horizontalTop: AdData | null;
  horizontalBottom: AdData | null;
}

export default defineComponent({
  name: 'SessionPopupContainer',
  setup () {
    const ads: AdList = reactive({
      verticalLeft: null,
      verticalRight: null,
      horizontalTop: null,
      horizontalBottom: null
    })

    onBeforeMount(() => {
      const numOfAds = sponsorAdsData.ads.length
      ads.verticalLeft = sponsorAdsData.ads[Math.floor(Math.random() * numOfAds)]
      ads.verticalRight = sponsorAdsData.ads[Math.floor(Math.random() * numOfAds)]
      ads.horizontalTop = sponsorAdsData.ads[Math.floor(Math.random() * numOfAds)]
      ads.horizontalBottom = sponsorAdsData.ads[Math.floor(Math.random() * numOfAds)]
    })

    return {
      ads
    }
  }
})
</script>

<style scoped>
</style>
