import { App, inject, reactive, readonly, ref, toRefs } from 'vue'
import { createServices } from '@/services'
import { ThemeService, ThemeType } from '@/services/theme'
import { BreakpointService } from '@/services/breakpoint'
import { AnnouncementService } from '@/services/announcement'
import { FullPageProgressService } from '@/services/fullPageProgress'
import { ScrollLockService } from '@/services/scrollLock'
import { LanguageService, LanguageType } from '@/services/language'
import { PopupData, PopupService } from '@/services/popup'
import { MetaOptions, MetaService } from '@/services/meta'
import { AgendaService, Day, DayData } from '@/services/agenda'

function createAgendaStore (agendaService: AgendaService) {
  const agendaDays = ref<Day[]>([])
  const agendaDaysData = ref<(DayData)[]>([])
  agendaService.onUpdated(() => {
    agendaDays.value = agendaService.getDays()
    agendaDaysData.value = agendaService.getDays().map((_, index) => agendaService.getDayData(index))
  })
  return {
    agendaDays: readonly(agendaDays),
    agendaDaysData: readonly(agendaDaysData),
    getSessionById: (sessionId: string) => agendaService.getSessionById(sessionId),
    getRoomById: (roomId: string) => agendaService.getRoomById(roomId),
    getSessionPopupData: (sessionId: string, language: 'en' | 'zh') => agendaService.getSessionPopupData(sessionId, language),
    getRoomsInProgressSession: () => agendaService.getRoomsInProgressSession(),
    initAgenda: () => agendaService.init()
  }
}

function createAnnouncementStore (announcementService: AnnouncementService) {
  const announcementHasUpdated = ref(announcementService.hasUpdated)
  announcementService.onUpdated(() => { announcementHasUpdated.value = announcementService.hasUpdated })
  return {
    announcementHasUpdated: readonly(announcementHasUpdated),
    showAnnouncement: (onClose?: (() => void)) => announcementService.showAnnouncement(onClose)
  }
}

function createBreakpointStore (breakpointService: BreakpointService) {
  type Property = Exclude<keyof BreakpointService, 'startDetect' | 'stopDetect' | 'onUpdated'>
  type State = Pick<BreakpointService, Property>
  const properties: Property[] = ['breakpoint', 'xsOnly', 'smOnly', 'mdOnly', 'lgOnly', 'xlOnly', 'smAndUp', 'smAndDown', 'mdAndUp', 'mdAndDown', 'lgAndUp', 'lgAndDown']
  const getBreakpointState = () => {
    return Object.fromEntries(properties.map((key) => [key, breakpointService[key]])) as State
  }
  const breakpointState = reactive(getBreakpointState())
  breakpointService.onUpdated(() => {
    const currentState = getBreakpointState()
    properties.forEach((key) => { Reflect.set(breakpointState, key, currentState[key]) })
  })

  return {
    ...toRefs(readonly(breakpointState)),
    startDetectBreakpoint: () => breakpointService.startDetect(),
    stopDetectBreakpoint: () => breakpointService.stopDetect()
  }
}

function createFullPageProgressStore (fullPageProgressService: FullPageProgressService) {
  const isFullPageProgressLoading = ref(fullPageProgressService.isLoading)
  fullPageProgressService.onUpdated(() => { isFullPageProgressLoading.value = fullPageProgressService.isLoading })
  return {
    isFullPageProgressLoading: readonly(isFullPageProgressLoading),
    setFullPageProgressStatus: (value: boolean) => fullPageProgressService.setStatus(value)
  }
}

function createLanguageStore (languageService: LanguageService) {
  const languageType = ref(languageService.languageType)
  const languagePack = ref(languageService.languagePack)
  languageService.onUpdated(() => {
    languageType.value = languageService.languageType
    languagePack.value = languageService.languagePack
  })
  return {
    languageType: readonly(languageType),
    languagePack: readonly(languagePack),
    setLanguageType: (languageType: LanguageType) => {
      languageService.languageType = languageType
    },
    getLanguagePack: (languageType: LanguageType) => {
      return readonly(languageService.languagePackSet[languageType])
    }
  }
}

function createMetaStore (metaService: MetaService) {
  const meta = ref(metaService.currentMetaValues)
  metaService.onUpdated(() => { meta.value = metaService.currentMetaValues })
  return {
    meta: readonly(meta),
    setMeta: (options: MetaOptions) => { metaService.setMeta(options) },
    resetMeta: () => { metaService.resetMeta() }
  }
}

function createPopupStore (popupService: PopupService) {
  const isPopup = ref(popupService.isPopup)
  const popupData = ref(popupService.popupData)
  popupService.onUpdated(() => {
    isPopup.value = popupService.isPopup
    popupData.value = popupService.popupData
  })
  return {
    isPopup: readonly(isPopup),
    popupData: readonly(popupData),
    popup: (popupData: PopupData) => { popupService.popup(popupData) },
    closePopup: () => { popupService.close() }
  }
}

function createScollLockStore (scrollLockService: ScrollLockService) {
  const isScrollLocked = ref(scrollLockService.isLocked)
  const currentScrollLockedPosition = ref(scrollLockService.currentScrollPosition)
  scrollLockService.onUpdated(() => {
    isScrollLocked.value = scrollLockService.isLocked
    currentScrollLockedPosition.value = scrollLockService.currentScrollPosition
  })
  return {
    isScrollLocked: readonly(isScrollLocked),
    currentScrollLockedPosition: readonly(currentScrollLockedPosition),
    lockScroll: () => scrollLockService.lock(),
    unlockScroll: () => scrollLockService.unlock()
  }
}

function createThemeStore (themeService: ThemeService) {
  const themeType = ref(themeService.themeType)
  themeService.onUpdated(() => { themeType.value = themeService.themeType })
  return {
    themeType: readonly(themeType),
    startDetectTheme: () => themeService.startDetect(),
    stopDetectTheme: () => themeService.stopDetect(),
    setThemeType: (value: ThemeType) => {
      themeService.themeType = value
    }
  }
}

export function createStore () {
  const services = createServices()

  const agendaStore = createAgendaStore(services.agendaService)
  const announcementStore = createAnnouncementStore(services.announcementService)
  const breakpointStore = createBreakpointStore(services.breakpointService)
  const fullPageProgressStore = createFullPageProgressStore(services.fullPageProgressService)
  const languageStore = createLanguageStore(services.languageService)
  const metaStore = createMetaStore(services.metaService)
  const popupStore = createPopupStore(services.popupService)
  const scollLockStore = createScollLockStore(services.scrollLockService)
  const themeStore = createThemeStore(services.themeService)

  const store = {
    services: services,
    install: (app: App) => {
      app.provide('store', store)
    },
    ...agendaStore,
    ...announcementStore,
    ...breakpointStore,
    ...fullPageProgressStore,
    ...languageStore,
    ...metaStore,
    ...popupStore,
    ...scollLockStore,
    ...themeStore
  }

  return store
}

export function useStore () {
  const store = inject<ReturnType<typeof createStore>>('store')
  if (!store) throw new Error('"store" is not provided')
  return store
}
