// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import App from './App.vue'
import Icon from '@/components/Basic/Icon/index.vue'
import { RenderedEventDispatcher } from '@/plugins/renderedEventDispatcher'
import { createRouter } from '@/router'
import { createAnnouncementService, AnnouncementService } from '@/services/announcement'
import { createBreakpointService, BreakpointService } from '@/services/breakpoint'
import { createFullPageProgressService, FullPageProgressService } from '@/services/fullPageProgress'
import { createLanguageService, LanguageService } from '@/services/language'
import { createMetaService, MetaService } from '@/services/meta'
import { createPopupService, PopupService } from '@/services/popup'
import { createScrollLockService, ScrollLockService } from '@/services/scrollLock'
import { createThemeService, ThemeService } from '@/services/theme'

Vue.use(RenderedEventDispatcher)
Vue.use(VueCompositionAPI)

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
  metaService,
  popupService
})

const root = new Vue({
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
})

document.addEventListener('DOMContentLoaded', () => {
  root.$mount('#app')
})
