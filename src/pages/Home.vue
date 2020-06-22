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
import Vue from 'vue'
import markdown from '@/utils/markdown'
import '@/assets/scss/pages/home.scss'
import { injectedThis } from '@/utils/common'
import { LanguageService } from '@/utils/language'

function injected (thisArg: unknown) {
  return injectedThis<{
    languageService: LanguageService;
  }>(thisArg)
}

interface Section {
  name: 'notice' | 'about';
  title: string;
  content: string;
}

export default Vue.extend({
  name: 'Home',
  inject: ['languageService'],
  computed: {
    sections (): Section[] {
      return [
        {
          name: 'notice',
          title: injected(this).languageService.languagePack.home.notice.title,
          content: this.noticeHtml
        },
        {
          name: 'about',
          title: injected(this).languageService.languagePack.home.about.title,
          content: this.aboutHtml
        }
      ]
    }
  },
  data () {
    return {
      noticeHtml: '',
      aboutHtml: ''
    }
  },
  methods: {
    async parseMarkdownContent () {
      this.noticeHtml = `<div class="markdown">${await markdown(injected(this).languageService.languagePack.home.notice.content)}</div>`
      this.aboutHtml = `<div class="markdown">${await markdown(injected(this).languageService.languagePack.home.about.content)}</div>`
    }
  },
  watch: {
    'languageService.languageType' () {
      this.parseMarkdownContent()
    }
  },
  async mounted () {
    await this.parseMarkdownContent()
    this.$emit('render')
  }
})
</script>
