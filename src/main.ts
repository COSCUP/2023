// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'

import { createThemeService, ThemeService } from '@/utils/theme'
import { createLanguageService, LanguageService } from '@/utils/language'
import { createBreakpointService, BreakpointService } from '@/utils/breakpoint'
import { createScrollLockService, ScrollLockService } from '@/utils/scrollLock'
import { createFullPageProgressService, FullPageProgressService } from '@/utils/fullPageProgress'
import { createPopupService, PopupService } from '@/utils/popup'
import { createMetaService, MetaService } from '@/utils/meta'
import { createAnnouncementService, AnnouncementService } from '@/utils/announcement'

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
