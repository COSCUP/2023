<!--
  Copyright (c) 2023 yoyo930021

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main id="topics" class="page-container">
    <div
      v-if="topicsList"
      class="outer-container"
    >
      <div
        v-for="topic in topicsList"
        :key="topic.id"
        class="card topics-container"
      >
        <a class="author" :name="topic.id" />
        <div class="img-container">
          <a :href="topic.link || undefined" target="_blank" rel="noopener">
            <img
              :src="topic.image"
              :alt="`topics ${topic.name[languageType]}'s logo`"
            />
          </a>
        </div>
        <div class="content-container">
          <a :href="topic.link || undefined" target="_blank" rel="noopener">
            <h2>
              {{ topic.name[languageType] }}
            </h2>
          </a>
          <article
            v-html="topic.intro[languageType]"
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
import topicsData from '@/assets/json/topics.json'

import '@/assets/scss/pages/topics.scss'
import { useBreakpoints } from '@/modules/breakpoints'
import { Locale } from '@/modules/i18n'
import { useI18n } from 'vue-i18n'
import { isClient } from '@vueuse/core'

export default defineComponent({
  name: 'Topics',
  setup () {
    const { locale, t } = useI18n()
    const { breakpoint } = useBreakpoints()

    const languageType = computed(() => locale.value as Locale)

    const topicsList = computed(() => topicsData.tipics.map((el) => ({
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
      topicsList,
      onReadmoreClick
    }
  }
})
</script>
