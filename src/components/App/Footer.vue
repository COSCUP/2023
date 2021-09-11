<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <div class="footer-container">
    <footer id="footer">
      <section class="footer__section">
        <p class="title">COSCUP</p>
        <p class="content">
          Conference for Open Source Coders, Users, and Promoters
        </p>
      </section>
      <section class="footer__section">
        <div class="content contacts">
            <div class="contact">
                <p class="subtitle">{{ t('app.footer.contact_attendee') }}</p>
                <p><a href="mailto:attendee@coscup.org">attendee@coscup.org</a></p>
            </div>
            <div class="contact">
                <p class="subtitle">{{ t('app.footer.contact_sponsorship') }}</p>
                <p><a href="mailto:sponsorship@coscup.org">sponsorship@coscup.org</a></p>
            </div>
            <div class="contact">
                <p class="subtitle">{{ t('app.footer.contact_program') }}</p>
                <p><a href="mailto:program@coscup.org">program@coscup.org</a></p>
            </div>
            <div class="contact">
                <p class="subtitle">{{ t('app.footer.contact_marketing') }}</p>
                <p><a href="mailto:marketing@coscup.org">marketing@coscup.org</a></p>
            </div>
        </div>
      </section>
      <section class="footer__section">
        <p class="title">
          {{ t('app.footer.websites') }}
        </p>
        <div class="content past">
          <a
            v-for="i in numOfPast"
            :href="`https://coscup.org/${2006 + i - 1}/`"
            :key="`website-${2006 + i - 1}`"
            class="past-link"
            target="_blank"
            rel="noopener"
            >{{ 2006 + i - 1 }}</a
          >
        </div>
      </section>
      <section class="footer__section">
        <p class="title">
          {{ t('app.footer.social') }}
        </p>
        <div class="content">
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
        </div>
      </section>
    </footer>
  </div>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n'
import { defineComponent } from 'vue'
import IconBlogger from 'virtual:vite-icons/fa-brands/blogger'
import IconFacebook from 'virtual:vite-icons/fa-brands/facebook'
import IconFlickr from 'virtual:vite-icons/fa-brands/flickr'
import IconPlurk from 'virtual:vite-icons/el/plurk-alt'
import IconTwitter from 'virtual:vite-icons/fa-brands/twitter'
import IconYoutube from 'virtual:vite-icons/fa-brands/youtube'
import IconTelegram from 'virtual:vite-icons/fa-brands/telegram-plane'
import IconBullhorn from 'virtual:vite-icons/fa-solid/bullhorn'
import IconMedium from 'virtual:vite-icons/fa-brands/medium'

export default defineComponent({
  name: 'Footer',
  setup () {
    const { t } = useI18n()
    const numOfPast = 2021 - 2006

    return {
      t,
      numOfPast,
      communityMedia: [
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
    }
  }
})
</script>
