<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main id="sponsor" class="page-container">
    <div class="card outer-container">
      <h2 class="title">
        {{ languagePack.sponsor.callForSponsorship.title }}
      </h2>
      <p class="call-for-sponsorship">
        {{ languagePack.sponsor.callForSponsorship.content }}
        <a href="mailto:sponsorship@coscup.org"> sponsorship@coscup.org </a>
      </p>
    </div>
    <div
      v-for="level in Object.keys(sponsorGroups)"
      :key="`sponsor-level-${level}`"
      class="outer-container"
    >
      <h2 class="title level">
        {{ languagePack.sponsor.level[level] }}
      </h2>
      <div
        v-for="sponsor in sponsorGroups[level]"
        :key="sponsor.id"
        class="card sponsor-container"
      >
        <div class="img-container">
          <a :href="`${sponsor.link}`" target="_blank" rel="noopener">
            <img
              :src="`/2020/images/sponsors/${sponsor.image}`"
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
            v-if="introSet[sponsor.id] && introSet[sponsor.id][languageType]"
            v-html="introSet[sponsor.id][languageType]"
            class="markdown"
          ></article>
          <div class="readmore" @click="onReadmoreClick">
            <span>Read More</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { groupBy } from 'lodash'
import { availableLanguageTypes, LanguageType } from '@/services/language'
import markdown from '@/utils/markdown'
import sponsorDatas from '@/../public/json/sponsor.json'

import '@/assets/scss/pages/sponsor.scss'
import { useRenderedEventDispatcher } from '../plugins/renderedEventDispatcher'
import { useStore } from '@/store'

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];
type SopnsorData = ArrayElement<typeof sponsorDatas>
type Intro = {
  [languageType in LanguageType]: string;
}
interface IntroSet {
  [id: string]: Intro;
}

export default defineComponent({
  name: 'Sponsor',
  setup () {
    const { breakpoint, languageType, languagePack } = useStore()
    const despatchRenderedEvent = useRenderedEventDispatcher()

    const sponsorGroups = reactive(Object.fromEntries(Object.entries(groupBy<SopnsorData>(sponsorDatas, 'level'))
      .sort((entryA, entryB) => {
        const sponsorSequence = ['titanium', 'diamond', 'gold', 'silver', 'bronze', 'co-organizer', 'special-thanks']
        return sponsorSequence.indexOf(entryA[0]) - sponsorSequence.indexOf(entryB[0])
      })))

    const introSet = ref<IntroSet>({})

    const renderSponsorsIntro = async () => {
      const intros: IntroSet = {}
      for (const data of sponsorDatas) {
        intros[data.id] = {
          en: '',
          'zh-TW': ''
        }
        for (const languageType of availableLanguageTypes) {
          intros[data.id][languageType] = await markdown(data.intro[languageType])
        }
      }
      introSet.value = intros
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
      const contentContainer = (event.target as HTMLElement).parentElement as HTMLElement
      contentContainer.classList.remove('folded')
    }

    watch(() => breakpoint.value, async () => {
      detectOverflowContentElements()
    })

    onMounted(async () => {
      await renderSponsorsIntro()
      detectOverflowContentElements()
      despatchRenderedEvent()
    })

    return {
      languageType,
      languagePack,
      introSet,
      sponsorGroups,
      onReadmoreClick
    }
  }
})
</script>
