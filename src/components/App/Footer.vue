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
        <p class="title">
          {{ languageManager.languagePack.app.footer.websites }}
        </p>
        <div class="content past">
          <a
            v-for="i in numOfPast"
            :href="`https://coscup.org/${2006 + i}/`"
            :key="`website-${2006 + i}`"
            class="past-link"
            target="_blank"
            rel="noopener"
            >{{ 2006 + i }}</a
          >
        </div>
      </section>
      <section class="footer__section">
        <p class="title">
          {{ languageManager.languagePack.app.footer.social }}
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
            <Icon :name="media.icon"> </Icon>
          </a>
        </div>
      </section>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Footer',
  inject: ['languageManager'],
  computed: {
    numOfPast () {
      return new Date().getFullYear() - 2006 - 1
    }
  },
  data () {
    return {
      communityMedia: [
        {
          name: 'blogger',
          icon: 'blogger',
          link: 'http://blog.coscup.org/'
        },
        {
          name: 'facebook',
          icon: 'facebook',
          link: 'https://www.facebook.com/coscup/'
        },
        {
          name: 'flickr',
          icon: 'flickr',
          link: 'https://www.flickr.com/photos/coscup/'
        },
        {
          name: 'plurk',
          icon: 'plurk',
          link: 'https://www.plurk.com/coscup'
        },
        {
          name: 'twitter',
          icon: 'twitter',
          link: 'https://twitter.com/coscup'
        },
        {
          name: 'youtube',
          icon: 'youtube',
          link: 'https://www.youtube.com/user/thecoscup'
        },
        {
          name: 'telegram',
          icon: 'telegram',
          link: 'https://t.me/coscupchat'
        },
        {
          name: 'channel',
          icon: 'bullhorn',
          link: 'https://t.me/coscup'
        }
      ]
    }
  }
})
</script>
