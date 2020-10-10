import { createAgendaService } from '@/services/agenda'
import { createAnnouncementService, AnnouncementService } from '@/services/announcement'
import { createBreakpointService, BreakpointService } from '@/services/breakpoint'
import { createFullPageProgressService, FullPageProgressService } from '@/services/fullPageProgress'
import { createLanguageService, LanguageService } from '@/services/language'
import { createMetaService, MetaService } from '@/services/meta'
import { createPopupService, PopupService } from '@/services/popup'
import { createScrollLockService, ScrollLockService } from '@/services/scrollLock'
import { createThemeService, ThemeService } from '@/services/theme'

export function createServices () {
  const languageService: LanguageService = createLanguageService()
  const themeService: ThemeService = createThemeService()
  const breakpointService: BreakpointService = createBreakpointService()
  const scrollLockService: ScrollLockService = createScrollLockService()
  const metaService: MetaService = createMetaService()
  const fullPageProgressService: FullPageProgressService = createFullPageProgressService({
    lockScrolling: () => scrollLockService.lock(),
    unlockScrolling: () => scrollLockService.unlock()
  })
  const popupService: PopupService = createPopupService({
    lockScrolling: () => scrollLockService.lock(),
    unlockScrolling: () => scrollLockService.unlock(),
    setMeta: (options) => metaService.setMeta(options)
  })
  const announcementService: AnnouncementService = createAnnouncementService({
    getLanguageType: () => languageService.languageType,
    popup: (data) => popupService.popup(data)
  })
  const agendaService = createAgendaService([
    'RB105',
    'AU',
    'TR209', 'TR211', 'TR212', 'TR213', 'TR214',
    'TR309', 'TR311', 'TR313',
    'TR409-2', 'TR410', 'TR411', 'TR412-1', 'TR412-2', 'TR413-1', 'TR413-2'
  ])

  return {
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
