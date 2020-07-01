import { inject } from '@vue/composition-api'
import { AgendaService } from './agenda'
import { AnnouncementService } from './announcement'
import { BreakpointService } from './breakpoint'
import { FullPageProgressService } from './fullPageProgress'
import { LanguageService } from './language'
import { MetaService } from './meta'
import { PopupService } from './popup'
import { ScrollLockService } from './scrollLock'
import { ThemeService } from './theme'

function useService<S> (serviceName: string): S {
  const service = inject<S>(serviceName)
  if (!service) throw new Error(`"${serviceName}" is not provided`)
  return service
}

export function useAgendaService (): AgendaService {
  return useService<AgendaService>('agendaService')
}

export function useAnnouncementService (): AnnouncementService {
  return useService<AnnouncementService>('announcementService')
}

export function useBreakpointService (): BreakpointService {
  return useService<BreakpointService>('breakpointService')
}

export function useFullPageProgressService (): FullPageProgressService {
  return useService<FullPageProgressService>('fullPageProgressService')
}

export function useLanguageService (): LanguageService {
  return useService<LanguageService>('languageService')
}

export function useMetaService (): MetaService {
  return useService<MetaService>('metaService')
}

export function usePopupService (): PopupService {
  return useService<PopupService>('popupService')
}

export function useScrollLockService (): ScrollLockService {
  return useService<ScrollLockService>('scrollLockService')
}

export function useThemeService (): ThemeService {
  return useService<ThemeService>('themeService')
}
