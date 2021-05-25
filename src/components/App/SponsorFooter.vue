<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <section id="sponsor-footer">
    <div
      v-for="groupEntry in sponsorGroups"
      :key="`sponsor-group-${groupEntry[0]}`"
      class="outer-container"
    >
      <div class="level-container">
        <p class="level">
          {{ t(`sponsor.level['${groupEntry[0]}']`) }}
        </p>
      </div>
      <div class="inner-container">
        <a
          v-for="sponsor in groupEntry[1]"
          :key="sponsor.id"
          class="sponsor"
          :href="`${sponsor.link}`"
          target="_blank"
          rel="noopener"
        >
          <img
            :alt="sponsor.name"
            :src="sponsor.image"
          />
          <p class="name">{{ sponsor.name }}</p>
        </a>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { groupBy } from 'lodash'
import sponsorDatas from '@/assets/json/sponsor.json'
import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Locale } from '@/modules/i18n'
// import { generateAssetsMap } from '@/utils/common'

// const imagesMap = generateAssetsMap(
//   import.meta.globEager('../../assets/images/sponsors/*.png'),
//   '../../assets/images/sponsors/*.png'
// )

export default defineComponent({
  name: 'SponsorFooter',
  setup () {
    const { t, locale } = useI18n()
    const sponsorGroups = computed(() => Object.entries(groupBy(sponsorDatas.map((data) => {
      return {
        level: data.level,
        id: data.id,
        name: data.name[locale.value as Locale],
        link: data.link,
        image: data.image
        // image: imagesMap[data.image]
      }
    }), 'level'))
      .sort((entryA, entryB) => {
        const sponsorSequence = ['titanium', 'diamond', 'gold', 'silver', 'bronze', 'co-organizer', 'special-thanks']
        return sponsorSequence.indexOf(entryA[0]) - sponsorSequence.indexOf(entryB[0])
      })
    )

    return {
      sponsorGroups,
      t
    }
  }
})
</script>
