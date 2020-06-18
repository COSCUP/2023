<template>
  <div id="app">
    <Navbar></Navbar>
    <div
      :class="{
        'scroll-lock': scrollLockManager.isLocked
      }"
      :style="{
        '--current-scroll-x': `${scrollLockManager.currentScrollPosition.x}px`,
        '--current-scroll-y': `${scrollLockManager.currentScrollPosition.y}px`
      }"
      class="main-container"
    >
      <transition :name="pageTransitionName" mode="out-in">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
      <Footer></Footer>
    </div>
    <FullPageProgress v-show="fullPageProgressManager.isLoading">
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
import { LanguageManager } from '@/utils/language'
import { BreakpointManager } from '@/utils/breakpoint'
import { ThemeManager } from '@/utils/theme'
import { ScrollLockManager } from '@/utils/scrollLock'
import { FullPageProgressManager } from '@/utils/fullPageProgress'
import { PopupManager } from '@/utils/popup'
import { Route } from 'vue-router'

function injected (thisArg: unknown) {
  return injectedThis<{
    languageManager: LanguageManager;
    themeManager: ThemeManager;
    breakpointManager: BreakpointManager;
    scrollLockManager: ScrollLockManager;
    fullPageProgressManager: FullPageProgressManager;
    popupManager: PopupManager;
  }>(thisArg)
}

export default Vue.extend({
  name: 'App',
  inject: [
    'languageManager',
    'themeManager',
    'breakpointManager',
    'scrollLockManager',
    'fullPageProgressManager',
    'popupManager'
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
    }
  },
  methods: {
    updatePageTransitionName (newRouteName: string, oldRouteName: string): void {
      if (injected(this).breakpointManager.xsOnly) {
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
    }
  },
  async mounted () {
    injected(this).breakpointManager.startDetect()
    injected(this).themeManager.startDetect()
  },
  beforeDestroy () {
    injected(this).breakpointManager.stopDetect()
    injected(this).themeManager.stopDetect()
  }
})
</script>
