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
          <h2>COSCUP 2021</h2>
          <div class="logo-content">
            <img src="@/assets/images/banner-logo.svg" alt="COSCUP" />
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
          {{ t('home.info.venue') }}
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
          {{ t('home.info.tabs.announcement') }}
        </span>
      </router-link>
    </div>

    <section
      v-for="section in sections"
      :key="`section-${section.name}`"
      class="section-block"
    >
      <img class="prefix-icon" src="@/assets/images/logo.svg" />
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
import { defineComponent, ref, watch } from 'vue'
import markdown from '@/utils/markdown'

import '@/assets/scss/pages/home.scss'
import { useI18n } from 'vue-i18n'

interface Section {
  name: 'notice' | 'about';
  title: string;
  content: string;
}

export default defineComponent({
  name: 'Home',
  setup () {
    const { t, locale } = useI18n()
    const sections = ref<Section[]>([])

    watch(locale, async () => {
      sections.value = [
        {
          name: 'notice',
          title: t('home.notice.title'),
          content: markdown(t('home.notice.content'))
        },
        {
          name: 'about',
          title: t('home.about.title'),
          content: markdown(t('home.about.content'))
        }
      ]
    }, {
      immediate: true
    })

    return {
      t,
      sections
    }
  }
})
</script>
