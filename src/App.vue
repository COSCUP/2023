<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <div id="app">
    <Navbar></Navbar>
    <div
      :class="{
        'scroll-lock': scrollLockService.isLocked
      }"
      :style="{
        '--current-scroll-x': `${scrollLockService.currentScrollPosition.x}px`,
        '--current-scroll-y': `${scrollLockService.currentScrollPosition.y}px`
      }"
      class="main-container"
    >
      <transition :name="pageTransitionName" mode="out-in">
        <keep-alive>
          <router-view @render="onPageRender"></router-view>
        </keep-alive>
      </transition>
      <Footer></Footer>
    </div>
    <FullPageProgress v-show="fullPageProgressService.isLoading">
    </FullPageProgress>
    <Popup></Popup>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import '@/assets/scss/app.scss'
import Navbar from '@/components/App/Navbar/index.vue'
import Footer from '@/components/App/Footer.vue'
import FullPageProgress from '@/components/App/FullPageProgress.vue'
import Popup from '@/components/App/Popup/index.vue'
import { pageRouteNameList } from '@/router'

import { injectedThis } from '@/utils/common'
import { LanguageService } from '@/services/language'
import { BreakpointService } from '@/services/breakpoint'
import { ThemeService } from '@/services/theme'
import { ScrollLockService } from '@/services/scrollLock'
import { FullPageProgressService } from '@/services/fullPageProgress'
import { PopupService } from '@/services/popup'
import { Route, Location } from 'vue-router'
import { AnnouncementService } from '@/services/announcement'

function injected (thisArg: unknown) {
  return injectedThis<{
    languageService: LanguageService;
    themeService: ThemeService;
    breakpointService: BreakpointService;
    scrollLockService: ScrollLockService;
    fullPageProgressService: FullPageProgressService;
    popupService: PopupService;
    announcementService: AnnouncementService;
  }>(thisArg)
}

export default Vue.extend({
  name: 'App',
  inject: [
    'languageService',
    'themeService',
    'breakpointService',
    'scrollLockService',
    'fullPageProgressService',
    'popupService',
    'announcementService'
  ],
  components: {
    Navbar,
    Footer,
    FullPageProgress,
    Popup
  },
  data () {
    return {
      pageTransitionName: 'slide-left' as 'slide-left' | 'slide-right' | 'fade'
    }
  },
  watch: {
    '$route' (newRoute: Route, oldRoute: Route): void {
      this.updatePageTransitionName(newRoute.name ?? '', oldRoute.name ?? '')
      this.detectAnnouncementRoute()
    }
  },
  methods: {
    updatePageTransitionName (newRouteName: string, oldRouteName: string): void {
      if (injected(this).breakpointService.xsOnly) {
        this.pageTransitionName = 'fade'
        return
      }

      const newIndex = pageRouteNameList.indexOf(newRouteName)
      const oldIndex = pageRouteNameList.indexOf(oldRouteName)
      if (oldIndex < newIndex) {
        this.pageTransitionName = 'slide-left'
      } else {
        this.pageTransitionName = 'slide-right'
      }
    },
    detectAnnouncementRoute () {
      if (this.$route.query.popUp === 'announcement') {
        const onClose: () => void = () => {
          const query = { ...this.$route.query }
          delete query.popUp
          this.$router.push({
            ...(this.$route as Location),
            query
          })
        }
        injected(this).announcementService.showAnnouncement(onClose)
      }
    },
    detectAnnouncementUpdate () {
      if (injected(this).announcementService.hasUpdated) {
        this.$router.push({
          query: {
            ...this.$route.query,
            popUp: 'announcement'
          }
        })
      }
    },
    onPageRender (): void {
      document.dispatchEvent(new Event('x-app-rendered'))
      this.detectAnnouncementUpdate()
    }
  },
  async mounted () {
    injected(this).breakpointService.startDetect()
    injected(this).themeService.startDetect()
  },
  beforeDestroy () {
    injected(this).breakpointService.stopDetect()
    injected(this).themeService.stopDetect()
  }
})
</script>
