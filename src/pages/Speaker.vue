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
        <a class="author" :name="speaker.id" />
        <div class="img-container">
          <a :href="undefined" target="_blank" rel="noopener">
            <img
              :src="speaker.avatar"
              :alt="`topics ${speaker.name[languageType]}'s logo`"
            />
          </a>
        </div>
        <div class="content-container">
          <router-link
            v-if="speaker.sessionId"
            :to="{
              name: 'SessionDetail',
              params: {
                sessionId: speaker.sessionId
              },
              query: {
                from: 'Speaker'
              }}">
            <h2>
              {{ speaker.name[languageType] }}
            </h2>
          </router-link>
          <a v-else target="_blank" rel="noopener">
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

    const sessionList = computed(() => sessionData.sessions)

    const speakersTemp = computed(() => sessionData.speakers.map((el) => ({
      ...el,
      bio: {
        en: markdown(el.en.bio),
        'zh-TW': markdown(el.zh.bio)
      },
      name: {
        en: el.en.name,
        'zh-TW': el.zh.name
      },
      sessionId: sessionList.value.find(sp => sp.speakers.includes(el.id))?.id,
      prime: sessionList.value.find(sp => sp.speakers.includes(el.id))?.tags.includes('Prime')
    })))

    const primeSpeakerList = speakersTemp.value.filter((element, index, array) => {
      return element.prime === true
    }).sort((a, b) => {
      return a.zh.name.charCodeAt(0) - b.zh.name.charCodeAt(0)
    })

    const normalSpeakerList = speakersTemp.value.filter((element, index, array) => {
      return element.prime !== true
    }).sort((a, b) => {
      return a.zh.name.charCodeAt(0) - b.zh.name.charCodeAt(0)
    })

    const speakersList = computed(() => primeSpeakerList.concat(normalSpeakerList))

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
      speakersList,
      sessionList
    }
  }
})
</script>
