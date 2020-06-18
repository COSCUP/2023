import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'

import { createThemeManager, ThemeManager } from '@/utils/theme'
import { createLanguageManager, LanguageManager } from '@/utils/language'
import { createBreakpointManager, BreakpointManager } from '@/utils/breakpoint'
import { createScrollLockManager, ScrollLockManager } from '@/utils/scrollLock'
import { createFullPageProgressManager, FullPageProgressManager } from '@/utils/fullPageProgress'
import { createPopupManager, PopupManager } from '@/utils/popup'

import Icon from '@/components/Basic/Icon/index.vue'

Vue.component('Icon', Icon)

Vue.config.productionTip = false

const languageManager: LanguageManager = Vue.observable(createLanguageManager())
const themeManager: ThemeManager = Vue.observable(createThemeManager())
const breakpointManager: BreakpointManager = Vue.observable(createBreakpointManager())
const scrollLockManager: ScrollLockManager = Vue.observable(createScrollLockManager())
const fullPageProgressManager: FullPageProgressManager = Vue.observable(createFullPageProgressManager(scrollLockManager))
const popupManager: PopupManager = Vue.observable(createPopupManager(scrollLockManager))

const router = createRouter({
  languageManager,
  fullPageProgressManager: fullPageProgressManager
})

new Vue({
  provide: {
    languageManager,
    themeManager,
    breakpointManager,
    scrollLockManager,
    fullPageProgressManager,
    popupManager
  },
  router,
  render: h => h(App)
}).$mount('#app')
