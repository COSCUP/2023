// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'

import { createThemeService, ThemeService } from '@/services/theme'
import { createLanguageService, LanguageService } from '@/services/language'
import { createBreakpointService, BreakpointService } from '@/services/breakpoint'
import { createScrollLockService, ScrollLockService } from '@/services/scrollLock'
import { createFullPageProgressService, FullPageProgressService } from '@/services/fullPageProgress'
import { createPopupService, PopupService } from '@/services/popup'
import { createMetaService, MetaService } from '@/services/meta'
import { createAnnouncementService, AnnouncementService } from '@/services/announcement'

import Icon from '@/components/Basic/Icon/index.vue'

Vue.component('Icon', Icon)

Vue.config.productionTip = false

const languageService: LanguageService = Vue.observable(createLanguageService())
const themeService: ThemeService = Vue.observable(createThemeService())
const breakpointService: BreakpointService = Vue.observable(createBreakpointService())
const scrollLockService: ScrollLockService = Vue.observable(createScrollLockService())
const fullPageProgressService: FullPageProgressService = Vue.observable(createFullPageProgressService(scrollLockService))
const metaService: MetaService = Vue.observable(createMetaService())
const popupService: PopupService = Vue.observable(createPopupService({ scrollLockService, metaService }))
const announcementService: AnnouncementService = Vue.observable(createAnnouncementService({ languageService, popupService }))

const router = createRouter({
  languageService,
  fullPageProgressService,
  metaService
})

new Vue({
  provide: {
    languageService,
    themeService,
    breakpointService,
    scrollLockService,
    fullPageProgressService,
    popupService,
    metaService,
    announcementService
  },
  router,
  render: h => h(App)
}).$mount('#app')
