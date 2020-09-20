import { createRouter } from '@/router'
import { createAgendaService } from '@/services/agenda'
import { createAnnouncementService, AnnouncementService } from '@/services/announcement'
import { createBreakpointService, BreakpointService } from '@/services/breakpoint'
import { createFullPageProgressService, FullPageProgressService } from '@/services/fullPageProgress'
import { createLanguageService, LanguageService } from '@/services/language'
import { createMetaService, MetaService } from '@/services/meta'
import { createPopupService, PopupService } from '@/services/popup'
import { createScrollLockService, ScrollLockService } from '@/services/scrollLock'
import { createThemeService, ThemeService } from '@/services/theme'
import { reactive } from 'vue'
import { Router } from 'vue-router'

export default function () {
  const languageService: LanguageService = reactive(createLanguageService())
  const themeService: ThemeService = reactive(createThemeService())
  const breakpointService: BreakpointService = reactive(createBreakpointService())
  const scrollLockService: ScrollLockService = reactive(createScrollLockService())
  const metaService: MetaService = reactive(createMetaService())
  const fullPageProgressService: FullPageProgressService = reactive(createFullPageProgressService({
    lockScrolling: () => scrollLockService.lock(),
    unlockScrolling: () => scrollLockService.unlock()
  }))
  const popupService: PopupService = reactive(createPopupService({
    lockScrolling: () => scrollLockService.lock(),
    unlockScrolling: () => scrollLockService.unlock(),
    setMeta: (options) => metaService.setMeta(options)
  }))
  const announcementService: AnnouncementService = reactive(createAnnouncementService({
    getLanguageType: () => languageService.languageType,
    popup: (data) => popupService.popup(data)
  }))
  const agendaService = reactive(createAgendaService([
    'RB105',
    'AU',
    'TR209', 'TR211', 'TR212', 'TR213', 'TR214',
    'TR309', 'TR311', 'TR313',
    'TR409-2', 'TR410', 'TR411', 'TR412-1', 'TR412-2', 'TR413-1', 'TR413-2'
  ]))
  const router: Router = createRouter({
    setIsLoading: (isLoading) => fullPageProgressService.setStatus(isLoading),
    setLanguageType: (languageType) => (languageService.languageType = languageType),
    setMeta: (options) => metaService.setMeta(options),
    getPageTitle: (key) => languageService.languagePack[key].meta.title,
    isPopup: () => popupService.isPopup,
    isMobile: () => breakpointService.xsOnly
  })

  return {
    router,
    languageService,
    themeService,
    breakpointService,
    scrollLockService,
    fullPageProgressService,
    metaService,
    popupService,
    announcementService,
    agendaService
  }
}
