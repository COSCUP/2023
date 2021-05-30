<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main id="sponsor" class="page-container">
    <div class="card outer-container">
      <h2 class="title">
        {{ t('sponsor.callForSponsorship.title') }}
      </h2>
      <p class="call-for-sponsorship">
        {{ t('sponsor.callForSponsorship.content') }}
        <a href="mailto:sponsorship@coscup.org"> sponsorship@coscup.org </a>
      </p>
    </div>
    <template v-if="sponsorGroups">
      <div
        v-for="[level, sponsors] in Object.entries(sponsorGroups)"
        :key="`sponsor-level-${level}`"
        class="outer-container"
      >
        <h2 class="title level">
          {{ t(`sponsor.level['${level}']`) }}
        </h2>
        <div
          v-for="sponsor in sponsors"
          :key="sponsor.id"
          class="card sponsor-container"
        >
          <div class="img-container">
            <a :href="`${sponsor.link}`" target="_blank" rel="noopener">
              <img
                :src="sponsor.image"
                :alt="`Sponsor ${sponsor.name[languageType]}'s logo`"
              />
            </a>
          </div>
          <div class="content-container">
            <a :href="`${sponsor.link}`" target="_blank" rel="noopener">
              <h2>
                {{ sponsor.name[languageType] }}
              </h2>
            </a>
            <article
              v-html="sponsor.intro[languageType]"
              class="markdown"
            ></article>
            <div class="readmore" @click="onReadmoreClick">
              <span>Read More</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { groupBy } from 'lodash'
import markdown from '@/utils/markdown'
import sponsorDatas from '@/assets/json/sponsor.json'

import '@/assets/scss/pages/sponsor.scss'
import { useBreakpoints } from '@/modules/breakpoints'
import { Locale } from '@/modules/i18n'
import { useI18n } from 'vue-i18n'
import { isClient } from '@vueuse/core'
// import { generateAssetsMap } from '@/utils/common'

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];
type SopnsorData = ArrayElement<typeof sponsorDatas>
type SponsorGroups = Record<string, SopnsorData[]>

// const imagesMap = generateAssetsMap(
//   import.meta.globEager('../assets/images/sponsors/*.png'),
//   '../assets/images/sponsors/*.png'
// )

export default defineComponent({
  name: 'Sponsor',
  setup () {
    const { locale, t } = useI18n()
    const { breakpoint } = useBreakpoints()

    const languageType = computed(() => locale.value as Locale)

    const sponsorGroups = ref<SponsorGroups | null>(null)
    const initSponsorGroups = async () => {
      sponsorGroups.value = Object.fromEntries(
        await Promise.all(Object.entries(groupBy<SopnsorData>(sponsorDatas, 'level'))
          .sort((entryA, entryB) => {
            const sponsorSequence = ['titanium', 'diamond', 'gold', 'silver', 'bronze', 'co-organizer', 'special-thanks', 'friend']
            return sponsorSequence.indexOf(entryA[0]) - sponsorSequence.indexOf(entryB[0])
          })
          .map(async ([group, rawSponsors]) => {
            const sponsors = await Promise.all(rawSponsors.map(async (rawSponsor) => {
              const sponsor: SopnsorData = {
                // ...rawSponsor,
                // image: imagesMap[rawSponsor.image]
                ...rawSponsor
              }

              sponsor.intro = {
                en: markdown(sponsor.intro.en),
                'zh-TW': markdown(sponsor.intro['zh-TW'])
              }

              return sponsor
            }))
            return [group, sponsors]
          }))
      )
    }

    const detectOverflowContentElements = () => {
      const elements = Array.from(document.querySelectorAll('#sponsor .content-container'))
      elements.forEach((element) => {
        element.classList.remove('folded')
      })
      elements.forEach((element) => {
        if (element.getBoundingClientRect().height > 300) {
          element.classList.add('folded')
        }
      })
    }

    const onReadmoreClick = (event: MouseEvent) => {
      if (!isClient) return
      const contentContainer = (event.target as HTMLElement).parentElement as HTMLElement
      contentContainer.classList.remove('folded')
    }

    onMounted(async () => {
      await initSponsorGroups()
      isClient && detectOverflowContentElements()
    })

    isClient && watch(() => breakpoint.value, async () => {
      detectOverflowContentElements()
    })

    return {
      t,
      languageType,
      sponsorGroups,
      onReadmoreClick
    }
  }
})
</script>
