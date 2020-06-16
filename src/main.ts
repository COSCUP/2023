import Vue from 'vue'
import App from './App.vue'
import router, { registerLanguageBeforeEachGuard } from './router'

import { createThemeManager, ThemeManager } from '@/utils/theme'
import { createLanguageManager, LanguageManager } from '@/utils/language'
import { createBreakpointManager, BreakpointManager } from '@/utils/breakpoint'
import { createScrollLockManager, ScrollLockManager } from '@/utils/scrollLock'

import Icon from '@/components/Basic/Icon/index.vue'

Vue.component('Icon', Icon)

Vue.config.productionTip = false

const languageManager: LanguageManager = Vue.observable(createLanguageManager())
const themeManager: ThemeManager = Vue.observable(createThemeManager())
const breakpointManager: BreakpointManager = Vue.observable(createBreakpointManager())
const scrollLockManager: ScrollLockManager = Vue.observable(createScrollLockManager())

registerLanguageBeforeEachGuard(languageManager)

new Vue({
  provide: {
    languageManager,
    themeManager,
    breakpointManager,
    scrollLockManager
  },
  router,
  render: h => h(App)
}).$mount('#app')
