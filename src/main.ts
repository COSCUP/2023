// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'

import { createThemeManager, ThemeManager } from '@/utils/theme'
import { createLanguageService, LanguageService } from '@/utils/language'
import { createBreakpointService, BreakpointService } from '@/utils/breakpoint'
import { createScrollLockManager, ScrollLockManager } from '@/utils/scrollLock'
import { createFullPageProgressService, FullPageProgressService } from '@/utils/fullPageProgress'
import { createPopupService, PopupService } from '@/utils/popup'
import { createMetaService, MetaService } from '@/utils/meta'
import { createAnnouncementService, AnnouncementService } from '@/utils/announcement'

import Icon from '@/components/Basic/Icon/index.vue'

Vue.component('Icon', Icon)

Vue.config.productionTip = false

const languageService: LanguageService = Vue.observable(createLanguageService())
const themeManager: ThemeManager = Vue.observable(createThemeManager())
const breakpointService: BreakpointService = Vue.observable(createBreakpointService())
const scrollLockManager: ScrollLockManager = Vue.observable(createScrollLockManager())
const fullPageProgressService: FullPageProgressService = Vue.observable(createFullPageProgressService(scrollLockManager))
const metaService: MetaService = Vue.observable(createMetaService())
const popupService: PopupService = Vue.observable(createPopupService({ scrollLockManager, metaService }))
const announcementService: AnnouncementService = Vue.observable(createAnnouncementService({ languageService, popupService }))

const router = createRouter({
  languageService,
  fullPageProgressService,
  metaService
})

new Vue({
  provide: {
    languageService,
    themeManager,
    breakpointService,
    scrollLockManager,
    fullPageProgressService,
    popupService,
    metaService,
    announcementService
  },
  router,
  render: h => h(App)
}).$mount('#app')
