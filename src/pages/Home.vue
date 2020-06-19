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
          {{ languageManager.languagePack.home.info.venue }}
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
          {{ languageManager.languagePack.home.info.tabs.announcement }}
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

    <!-- <div class="spotlight-container">
      <div class="spotlight sharp-back-taton">
        <h1 class="title has-prefix-icon">
          <img class="prefix-icon" src="/2020/images/logo.svg" />
          <span class="inner font-black">{{
            languageManager.languagePack.home.notice.title
          }}</span>
        </h1>
        <div
          v-html="
            markdownParser(languageManager.languagePack.home.notice.content)
          "
        ></div>
      </div>
    </div>
    <div class="spotlight-container">
      <div class="spotlight sharp-back-taton">
        <h1 class="title has-prefix-icon">
          <img class="prefix-icon" src="/2020/images/logo.svg" />
          <span class="inner font-black">{{
            languageManager.languagePack.home.about.title
          }}</span>
        </h1>
        <div v-html="markdownParser(languageManager.languagePack.home.about.content)"></div>
      </div>
    </div> -->
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import markdown from '@/utils/markdown'
import '@/assets/scss/pages/home.scss'
import { injectedThis } from '@/utils/common'
import { LanguageManager } from '@/utils/language'

function injected (thisArg: unknown) {
  return injectedThis<{
    languageManager: LanguageManager;
  }>(thisArg)
}

interface Section {
  name: 'notice' | 'about';
  title: string;
  content: string;
}

export default Vue.extend({
  name: 'Home',
  inject: ['languageManager'],
  computed: {
    sections (): Section[] {
      return [
        {
          name: 'notice',
          title: injected(this).languageManager.languagePack.home.notice.title,
          content: this.noticeHtml
        },
        {
          name: 'about',
          title: injected(this).languageManager.languagePack.home.about.title,
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
      this.noticeHtml = await markdown(injected(this).languageManager.languagePack.home.notice.content)
      this.aboutHtml = await markdown(injected(this).languageManager.languagePack.home.about.content)
    }
  },
  watch: {
    'languageManager.languageType' () {
      this.parseMarkdownContent()
    }
  },
  async mounted () {
    await this.parseMarkdownContent()
    this.$emit('render')
  }
})
</script>
