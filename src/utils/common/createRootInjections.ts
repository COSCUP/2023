import { createRouter } from '@/router'
import { createAnnouncementService, AnnouncementService } from '@/services/announcement'
import { createBreakpointService, BreakpointService } from '@/services/breakpoint'
import { createFullPageProgressService, FullPageProgressService } from '@/services/fullPageProgress'
import { createLanguageService, LanguageService } from '@/services/language'
import { createMetaService, MetaService } from '@/services/meta'
import { createPopupService, PopupService } from '@/services/popup'
import { createScrollLockService, ScrollLockService } from '@/services/scrollLock'
import { createThemeService, ThemeService } from '@/services/theme'
import { reactive } from '@vue/composition-api'
import VueRouter from 'vue-router'

export default function () {
  const languageService: LanguageService = reactive(createLanguageService())
  const themeService: ThemeService = reactive(createThemeService())
  const breakpointService: BreakpointService = reactive(createBreakpointService())
  const scrollLockService: ScrollLockService = reactive(createScrollLockService())
  const fullPageProgressService: FullPageProgressService = reactive(createFullPageProgressService(scrollLockService))
  const metaService: MetaService = reactive(createMetaService())
  const popupService: PopupService = reactive(createPopupService({ scrollLockService, metaService }))
  const announcementService: AnnouncementService = reactive(createAnnouncementService({ languageService, popupService }))
  const router: VueRouter = reactive(createRouter({ languageService, popupService, metaService, fullPageProgressService }))

  return {
    router,
    languageService,
    themeService,
    breakpointService,
    scrollLockService,
    fullPageProgressService,
    metaService,
    popupService,
    announcementService
  }
}
