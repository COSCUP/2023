<!--
  Copyright (c) 2022 yoyo930021

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main id="community" class="page-container">
    <div
      v-if="communityList"
      class="outer-container"
    >
      <div
        v-for="community in communityList"
        :key="community.id"
        class="card community-container"
      >
        <a class="author" :name="community.id" />
        <div class="img-container">
          <a :href="`${community.link}`" target="_blank" rel="noopener">
            <img
              :src="community.image"
              :alt="`Community ${community.name[languageType]}'s logo`"
            />
          </a>
        </div>
        <div class="content-container">
          <a :href="`${community.link}`" target="_blank" rel="noopener">
            <h2>
              {{ community.name[languageType] }}
            </h2>
          </a>
          <article
            v-html="community.intro[languageType]"
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
import communityData from '@/assets/json/community.json'

import '@/assets/scss/pages/community.scss'
import { useBreakpoints } from '@/modules/breakpoints'
import { Locale } from '@/modules/i18n'
import { useI18n } from 'vue-i18n'
import { isClient } from '@vueuse/core'

export default defineComponent({
  name: 'Sponsor',
  setup () {
    const { locale, t } = useI18n()
    const { breakpoint } = useBreakpoints()

    const languageType = computed(() => locale.value as Locale)

    const communityList = computed(() => communityData.map((el) => ({
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
      communityList,
      onReadmoreClick
    }
  }
})
</script>
