<!--
  Copyright (c) 2023 yoyo930021

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main id="speaker" class="page-container">
    <div
      v-if="speakersList"
      class="outer-container"
    >
      <div
        v-for="speaker in speakersList"
        :key="speaker.id"
        class="card speaker-container"
      >
        <div class="img-container">
            <img
              :src="speaker.avatar"
              :alt="`topics ${speaker.name[languageType]}'s logo`"
            />
        </div>
        <div class="content-container">
          <a target="_blank" rel="noopener">
            <h2>
              {{ speaker.name[languageType] }}
            </h2>
          </a>
          <article
            v-html="speaker.bio[languageType]"
            class="markdown"
          ></article>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, watch } from 'vue'
import markdown from '@/utils/markdown'
import sessionData from '@/assets/json/session.json'

import '@/assets/scss/pages/speaker.scss'
import { useBreakpoints } from '@/modules/breakpoints'
import { Locale } from '@/modules/i18n'
import { useI18n } from 'vue-i18n'
import { isClient } from '@vueuse/core'

export default defineComponent({
  name: 'Speaker',
  setup () {
    const { locale, t } = useI18n()
    const { breakpoint } = useBreakpoints()

    const languageType = computed(() => locale.value as Locale)

    const speakersList = computed(() => sessionData.speakers.map((el) => ({
      ...el,
      bio: {
        en: markdown(el.en.bio),
        'zh-TW': markdown(el.zh.bio)
      },
      name: {
        en: el.en.name,
        'zh-TW': el.zh.name
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

    onMounted(async () => {
      isClient && detectOverflowContentElements()
    })

    isClient && watch(() => breakpoint.value, async () => {
      detectOverflowContentElements()
    })

    return {
      t,
      languageType,
      speakersList
    }
  }
})
</script>
