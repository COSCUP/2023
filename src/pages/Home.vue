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
          {{ languagePack.home.info.venue }}
        </span>
      </div>
      <router-link
        class="announcement-toggle"
        :to="{
          query: {
            popUp: 'announcement',
          },
        }"
      >
        <span>
          {{ languagePack.home.info.tabs.announcement }}
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
import { defineComponent, ref, computed, watch, onMounted } from 'vue'
import markdown from '@/utils/markdown'
import { useRenderedEventDispatcher } from '@/plugins/renderedEventDispatcher'

import '@/assets/scss/pages/home.scss'
import { useStore } from '@/store'

interface Section {
  name: 'notice' | 'about';
  title: string;
  content: string;
}

export default defineComponent({
  name: 'Home',
  setup () {
    const { languageType, languagePack } = useStore()
    const despatchRenderedEvent = useRenderedEventDispatcher()
    const noticeHtml = ref('')
    const aboutHtml = ref('')
    const sections = computed<Section[]>(() => [
      {
        name: 'notice',
        title: languagePack.value.home.notice.title,
        content: noticeHtml.value
      },
      {
        name: 'about',
        title: languagePack.value.home.about.title,
        content: aboutHtml.value
      }
    ])

    const parseMarkdownContent = async () => {
      noticeHtml.value = await markdown(languagePack.value.home.notice.content)
      aboutHtml.value = await markdown(languagePack.value.home.about.content)
    }

    watch(() => languageType.value, parseMarkdownContent)

    onMounted(async () => {
      await parseMarkdownContent()
      despatchRenderedEvent()
    })

    return {
      languagePack,
      sections
    }
  }
})
</script>
