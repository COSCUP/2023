<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <div
    id="app"
    :class="{
      'in-app': isInApp
    }"
  >
    <Navbar v-if="!isInApp"></Navbar>
    <div
      :class="{
        'scroll-lock': scrollLockService.isLocked,
        popupped: popupService.isPopup
      }"
      :style="{
        '--current-scroll-x': `${scrollLockService.currentScrollPosition.x}px`,
        '--current-scroll-y': `${scrollLockService.currentScrollPosition.y}px`
      }"
      class="main-container"
    >
      <transition :name="pageTransitionName" mode="out-in">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
      <SponsorFooter></SponsorFooter>
      <Footer></Footer>
    </div>
    <FullPageProgress v-show="fullPageProgressService.isLoading">
    </FullPageProgress>
    <Popup></Popup>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Route, Location } from 'vue-router'
import Navbar from '@/components/App/Navbar/index.vue'
import SponsorFooter from '@/components/App/SponsorFooter.vue'
import Footer from '@/components/App/Footer.vue'
import FullPageProgress from '@/components/App/FullPageProgress.vue'
import Popup from '@/components/App/Popup/index.vue'
import { pageRouteNameList } from '@/router'
import { AnnouncementService } from '@/services/announcement'
import { BreakpointService } from '@/services/breakpoint'
import { FullPageProgressService } from '@/services/fullPageProgress'
import { LanguageService } from '@/services/language'
import { PopupService } from '@/services/popup'
import { ScrollLockService } from '@/services/scrollLock'
import { ThemeService } from '@/services/theme'
import { injectedThis } from '@/utils/common'

import '@/assets/scss/app.scss'

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
    SponsorFooter,
    Footer,
    FullPageProgress,
    Popup
  },
  data () {
    return {
      isInApp: false,
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
    onAppRender (): void {
      setTimeout(() => {
        this.detectAnnouncementUpdate()
      }, 1000)
    }
  },
  async mounted () {
    document.addEventListener('x-app-rendered', () => { this.onAppRender() })
    injected(this).breakpointService.startDetect()
    injected(this).themeService.startDetect()
    await this.$nextTick()
    this.isInApp = this.$route.query.mode === 'app'
  },
  beforeDestroy () {
    injected(this).breakpointService.stopDetect()
    injected(this).themeService.stopDetect()
  }
})
</script>
