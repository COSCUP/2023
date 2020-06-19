import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'

import { createThemeManager, ThemeManager } from '@/utils/theme'
import { createLanguageManager, LanguageManager } from '@/utils/language'
import { createBreakpointManager, BreakpointManager } from '@/utils/breakpoint'
import { createScrollLockManager, ScrollLockManager } from '@/utils/scrollLock'
import { createFullPageProgressManager, FullPageProgressManager } from '@/utils/fullPageProgress'
import { createPopupManager, PopupManager } from '@/utils/popup'
import { createMetaManager, MetaManager } from '@/utils/meta'
import { createAnnouncementManager, AnnouncementManager } from '@/utils/announcement'

import Icon from '@/components/Basic/Icon/index.vue'

Vue.component('Icon', Icon)

Vue.config.productionTip = false

const languageManager: LanguageManager = Vue.observable(createLanguageManager())
const themeManager: ThemeManager = Vue.observable(createThemeManager())
const breakpointManager: BreakpointManager = Vue.observable(createBreakpointManager())
const scrollLockManager: ScrollLockManager = Vue.observable(createScrollLockManager())
const fullPageProgressManager: FullPageProgressManager = Vue.observable(createFullPageProgressManager(scrollLockManager))
const metaManager: MetaManager = Vue.observable(createMetaManager())
const popupManager: PopupManager = Vue.observable(createPopupManager({ scrollLockManager, metaManager }))
const announcementManager: AnnouncementManager = Vue.observable(createAnnouncementManager({ languageManager, popupManager }))

const router = createRouter({
  languageManager,
  fullPageProgressManager,
  metaManager
})

new Vue({
  provide: {
    languageManager,
    themeManager,
    breakpointManager,
    scrollLockManager,
    fullPageProgressManager,
    popupManager,
    metaManager,
    announcementManager
  },
  router,
  render: h => h(App)
}).$mount('#app')
