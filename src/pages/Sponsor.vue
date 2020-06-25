<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main id="sponsor" class="page-container">
    <div class="card outer-container">
      <h2 class="title">
        {{ languageService.languagePack.sponsor.callForSponsorship.title }}
      </h2>
      <p class="call-for-sponsorship">
        {{ languageService.languagePack.sponsor.callForSponsorship.content }}
        <a href="mailto:sponsorship@coscup.org">
          sponsorship@coscup.org
        </a>
      </p>
    </div>
    <div
      v-for="level in Object.keys(sponsorGroups)"
      :key="`sponsor-level-${level}`"
      class="outer-container"
    >
      <h2 class="title level">
        {{ languageService.languagePack.sponsor.level[level] }}
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
              :alt="
                `Sponsor ${sponsor.name[languageService.languageType]}'s logo`
              "
            />
          </a>
        </div>
        <div class="content-container">
          <a :href="`${sponsor.link}`" target="_blank" rel="noopener">
            <h2>
              {{ sponsor.name[languageService.languageType] }}
            </h2>
          </a>
          <article
            v-html="sponsor.intro[languageService.languageType]"
            class="markdown"
          ></article>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import { groupBy } from 'lodash-es'
import { availableLanguageTypes } from '@/services/language'
import markdown from '@/utils/markdown'
import sponsorDatas from '@/../public/json/sponsor.json'

import '@/assets/scss/pages/sponsor.scss'

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];
type SopnsorData = ArrayElement<typeof sponsorDatas>

export default Vue.extend({
  name: 'Sponsor',
  inject: ['languageService'],
  data () {
    return {
      sponsorGroups: {} as object

    }
  },
  methods: {
    async initSponsors () {
      for (const data of sponsorDatas) {
        for (const languageType of availableLanguageTypes) {
          data.intro[languageType] = await markdown(data.intro[languageType])
        }
      }
      this.sponsorGroups = Object.fromEntries(Object.entries(groupBy<SopnsorData>(sponsorDatas, 'level'))
        .sort((entryA, entryB) => {
          const sponsorSequence = ['titanium', 'diamond', 'gold', 'silver', 'bronze', 'co-organizer', 'special-thanks']
          return sponsorSequence.indexOf(entryA[0]) - sponsorSequence.indexOf(entryB[0])
        }))
    }
  },
  async mounted () {
    await this.initSponsors()
    this.$dispatchRenderedEvent()
  }
})
</script>
