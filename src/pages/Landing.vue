<template>
  <main id="landing" class="page-container">
    <section class="info-block">
      <div class="logo-container">
        <img src='@/assets/images/banner.svg' alt="COSCUP Logo" />
      </div>
      <div class="info">
        <div class="row">
          <div class="icon">
            <icon-akar-icons-calendar></icon-akar-icons-calendar>
          </div>
          <span>2022/07/30 ~ 2022/07/31</span>
        </div>
        <div class="row">
          <div class="icon">
            <icon-akar-icons-location></icon-akar-icons-location>
          </div>
          <span>{{ t('landing.info.location') }}</span>
        </div>
      </div>
    </section>
    <section class="links">
      <a href="https://blog.coscup.org/2022/04/coscup-x-kcd-taiwan-2022-cfp-is-now.html" target="_blank" rel="noopener noreferrer">
        {{ t('landing.links.cfp') }}
      </a>
      <a href="https://blog.coscup.org/2022/04/coscup.html" target="_blank" rel="noopener noreferrer">
        {{ t('landing.links.ftp') }}
      </a>
      <a href="https://volunteer.coscup.org/" target="_blank" rel="noopener noreferrer">
        {{ t('landing.links.volunteer') }}
      </a>
      <router-link to="sponsorship">
        {{ t('landing.links.sponsor') }}
      </router-link>
    </section>
    <section class="media-links">
      <a
        v-for="media in communityMedia"
        :href="media.link"
        :key="`media-${media.name}`"
        class="media-link"
        target="_blank"
        rel="noopener"
      >
        <component :is="media.icon"></component>
      </a>
    </section>
    <section :key="`section-${section.name}`" class="section-block">
      <img class="prefix-icon" src="@/assets/images/logo.svg" />
      <h2 class="section-title">{{ section.title }}</h2>
      <article class="section-content notice markdown" v-html="section.content"></article>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import markdown from '@/utils/markdown'
import IconBlogger from 'virtual:vite-icons/fa-brands/blogger'
import IconFacebook from 'virtual:vite-icons/fa-brands/facebook'
import IconFlickr from 'virtual:vite-icons/fa-brands/flickr'
import IconPlurk from 'virtual:vite-icons/el/plurk-alt'
import IconTwitter from 'virtual:vite-icons/fa-brands/twitter'
import IconYoutube from 'virtual:vite-icons/fa-brands/youtube'
import IconTelegram from 'virtual:vite-icons/fa-brands/telegram-plane'
import IconBullhorn from 'virtual:vite-icons/fa-solid/bullhorn'
import IconMedium from 'virtual:vite-icons/fa-brands/medium'
import '@/assets/scss/pages/landing.scss'
import { useI18n } from 'vue-i18n'

interface Section {
  name: 'about';
  title: string;
  content: string;
}

const communityMedia = [
  {
    name: 'blogger',
    icon: IconBlogger,
    link: 'https://blog.coscup.org/'
  },
  {
    name: 'facebook',
    icon: IconFacebook,
    link: 'https://www.facebook.com/coscup/'
  },
  {
    name: 'flickr',
    icon: IconFlickr,
    link: 'https://www.flickr.com/photos/coscup/'
  },
  {
    name: 'plurk',
    icon: IconPlurk,
    link: 'https://www.plurk.com/coscup'
  },
  {
    name: 'twitter',
    icon: IconTwitter,
    link: 'https://twitter.com/coscup'
  },
  {
    name: 'youtube',
    icon: IconYoutube,
    link: 'https://www.youtube.com/user/thecoscup'
  },
  {
    name: 'telegram',
    icon: IconTelegram,
    link: 'https://t.me/coscupchat'
  },
  {
    name: 'channel',
    icon: IconBullhorn,
    link: 'https://t.me/coscup'
  },
  {
    name: 'medium',
    icon: IconMedium,
    link: 'https://coscup.medium.com'
  }
]

export default defineComponent({
  name: 'Home',
  setup () {
    const { t, locale } = useI18n()
    const section = ref<Section>({ name: 'about', title: '', content: '' })

    watch(locale, async () => {
      section.value =
      {
        name: 'about',
        title: t('landing.about.title'),
        content: markdown(t('landing.about.content'))
      }
    }, {
      immediate: true
    })

    return {
      t,
      section,
      communityMedia
    }
  }
})
</script>
