<!--
  Copyright (c) 2023 yoyo930021

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main id="booths" class="page-container">
    <div
      v-if="boothsList"
      class="outer-container"
    >
      <div
        v-for="booth in boothsList"
        :key="booth.id"
        class="card booths-container"
      >
        <a class="author" :name="booth.id" />
        <div class="img-container">
          <a :href="booth.link || undefined" target="_blank" rel="noopener">
            <img
              :src="booth.image"
              :alt="`booth ${booth.name[languageType]}'s logo`"
            />
          </a>
        </div>
        <div class="content-container">
          <a :href="booth.link || undefined" target="_blank" rel="noopener">
            <h2>
              {{ booth.name[languageType] }}
            </h2>
          </a>
          <article
            v-html="booth.intro[languageType]"
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
import { computed, defineComponent, onMounted, watch } from 'vue'
import markdown from '@/utils/markdown'
import boothsData from '@/assets/json/booths.json'

import '@/assets/scss/pages/booths.scss'
import { useBreakpoints } from '@/modules/breakpoints'
import { Locale } from '@/modules/i18n'
import { useI18n } from 'vue-i18n'
import { isClient } from '@vueuse/core'

export default defineComponent({
  name: 'Booths',
  setup () {
    const { locale, t } = useI18n()
    const { breakpoint } = useBreakpoints()

    const languageType = computed(() => locale.value as Locale)

    const boothsList = computed(() => boothsData.booths.map((el) => ({
      ...el,
      intro: {
        en: markdown(el.intro.en),
        'zh-TW': markdown(el.intro['zh-TW'])
      }
    })))

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
      isClient && detectOverflowContentElements()
    })

    isClient && watch(() => breakpoint.value, async () => {
      detectOverflowContentElements()
    })

    return {
      t,
      languageType,
      boothsList,
      onReadmoreClick
    }
  }
})
</script>
