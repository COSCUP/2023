<template>
  <div id="app">
    <Navbar></Navbar>
    <div
      class="main-container"
      :class="{
        'scroll-lock': scrollLockManager.isLocked
      }"
      :style="{
        '--current-scroll-x': `${scrollLockManager.currentScrollPosition.x}px`,
        '--current-scroll-y': `${scrollLockManager.currentScrollPosition.y}px`
      }"
    >
      <router-view />
      <Footer></Footer>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import '@/assets/scss/app.scss'
import Navbar from '@/components/App/Navbar/index.vue'
import Footer from '@/components/App/Footer.vue'

import { injectedThis } from '@/utils/common'
import { LanguageManager } from '@/utils/language'
import { BreakpointManager } from '@/utils/breakpoint'
import { ThemeManager } from '@/utils/theme'

function injected (thisArg: unknown) {
  return injectedThis<{
    languageManager: LanguageManager;
    themeManager: ThemeManager;
    breakpointManager: BreakpointManager;
  }>(thisArg)
}

export default Vue.extend({
  name: 'App',
  inject: ['languageManager', 'themeManager', 'breakpointManager', 'scrollLockManager'],
  components: {
    Navbar,
    Footer
  },
  mounted () {
    injected(this).breakpointManager.startDetect()
    injected(this).themeManager.startDetect()
  },
  beforeDestroy () {
    injected(this).breakpointManager.stopDetect()
    injected(this).themeManager.stopDetect()
  }
})
</script>
