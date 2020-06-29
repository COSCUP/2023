<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main id="home" class="page-container">
    <div class="banner-container">
      <div class="logo-wrapper">
        <div class="logo-container">
          <h2>COSCUP 2020</h2>
          <div class="logo-content">
            <img src="/2020/images/banner-logo.svg" alt="COSCUP" />
            <div>
              <p>Conference for Open Source Coders, Users & Promoters</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="info-container">
      <div class="info">
        <span class="date">8 / 1 ~ 8 / 2</span>
        <span class="venue">
          {{ languageService.languagePack.home.info.venue }}
        </span>
      </div>
      <router-link
        class="announcement-toggle"
        :to="{
          query: {
            popUp: 'announcement'
          }
        }"
      >
        <span>
          {{ languageService.languagePack.home.info.tabs.announcement }}
        </span>
      </router-link>
    </div>

    <section
      v-for="section in sections"
      :key="`section-${section.name}`"
      class="section-block"
    >
      <img class="prefix-icon" src="/2020/images/logo.svg" />
      <h2 class="section-title">
        {{ section.title }}
      </h2>
      <article
        class="section-content notice markdown"
        v-html="section.content"
      ></article>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from '@vue/composition-api'
import markdown from '@/utils/markdown'
import { useLanguageService } from '@/services/language'
import { useRenderedEventDispatcher } from '@/plugins/renderedEventDispatcher'

import '@/assets/scss/pages/home.scss'

interface Section {
  name: 'notice' | 'about';
  title: string;
  content: string;
}

export default defineComponent({
  name: 'Home',
  setup () {
    const despatchRenderedEvent = useRenderedEventDispatcher()
    const languageService = useLanguageService()
    const noticeHtml = ref('')
    const aboutHtml = ref('')
    const sections = computed<Section[]>(() => [
      {
        name: 'notice',
        title: languageService.languagePack.home.notice.title,
        content: noticeHtml.value
      },
      {
        name: 'about',
        title: languageService.languagePack.home.about.title,
        content: aboutHtml.value
      }
    ])

    const parseMarkdownContent = async () => {
      noticeHtml.value = await markdown(languageService.languagePack.home.notice.content)
      aboutHtml.value = await markdown(languageService.languagePack.home.about.content)
    }

    watch(() => languageService.languageType, parseMarkdownContent)

    onMounted(async () => {
      await parseMarkdownContent()
      despatchRenderedEvent()
    })

    return {
      languageService,
      sections
    }
  }
})
</script>
