// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { computed, InjectionKey, ref, Ref } from 'vue'
import { MetaOptions, useMetas } from '../metas'
import { useScrollLock } from '../scroll-lock'
import { createModuleHook, createModuleSetup } from '../utils'
import DefaultPopUpContainer from './components/Container/DefaultPopUpContainer.vue'
import SessionPopUpContainer from './components/Container/SessionPopUpContainer.vue'
import HtmlPopUpContent from './components/Content/HtmlPopUpContent.vue'

export { default as PopUp } from './components/PopUp.vue'

type Component = typeof import('*.vue')

export type PopUpContentType = 'html'

export type PopUpContainerType = 'default' | 'session'

interface BasicPopUpContainerData {
  type: PopUpContainerType;
}

export interface DefaultPopUpContainerData extends BasicPopUpContainerData {
  type: 'default';
}

export interface SessionPopUpContainerData extends BasicPopUpContainerData {
  type: 'session';
}

export type PopUpContainerData = DefaultPopUpContainerData | SessionPopUpContainerData

interface BasicPopUpContentData {
  type: PopUpContentType;
}

export interface HtmlPopUpContentData extends BasicPopUpContentData {
  type: 'html';
  html: string;
}

export type PopUpContentData = HtmlPopUpContentData

export interface PopUpData {
  popupId?: string;
  order?: number;
  metaOptions: MetaOptions;
  containerData: PopUpContainerData;
  contentData: PopUpContentData;
  onClose?: () => void;
}

interface UsePopUp {
  openPopUp: (data: PopUpData) => void;
  closePopUp: () => void;
  removeAll: (comparator?: (popUpData: PopUpData) => boolean) => void;
  currentPopUp: Ref<PopUpData | null>;
  currentContainerComponent: Ref<Component | null>;
  currentContentComponent: Ref<Component | null>;
}

const PROVIDE_KEY: InjectionKey<UsePopUp> = Symbol('pop-up')

const _usePopUp = (): UsePopUp => {
  const { lockScroll, unlockScroll } = useScrollLock()
  const { setMetas } = useMetas()
  const stack = ref<PopUpData[]>([])
  const currentPopUp = computed(() => {
    return stack.value.slice(-1).pop() ?? null
  })
  const currentContainerComponent = computed<Component | null>(() => {
    switch (currentPopUp.value?.containerData.type) {
      case 'default':
        return DefaultPopUpContainer
      case 'session':
        return SessionPopUpContainer
      default:
        return null
    }
  })
  const currentContentComponent = computed<Component | null>(() => {
    switch (currentPopUp.value?.contentData.type) {
      case 'html':
        return HtmlPopUpContent
      default:
        return null
    }
  })
  const openPopUp = (data: PopUpData) => {
    setMetas(data.metaOptions)
    lockScroll()
    const i = stack.value.findIndex((popUpData) =>
      (popUpData.order ?? 0) >= (data.order ?? 0))
    if (i === -1) {
      stack.value.push(data)
    } else {
      stack.value.splice(i + 1, 0, data)
    }
  }
  const closePopUp = () => {
    const popUp = stack.value.pop() ?? null
    if (popUp === null) return
    unlockScroll()
    popUp.onClose?.()
  }
  const removeAll = (comparator?: (popUpData: PopUpData) => boolean) => {
    if (comparator) {
      stack.value = stack.value.filter(comparator)
    } else {
      stack.value.length = 0
    }
  }
  return {
    currentPopUp,
    currentContainerComponent,
    currentContentComponent,
    openPopUp,
    closePopUp,
    removeAll
  }
}

export const setup = createModuleSetup(PROVIDE_KEY, _usePopUp)
export const usePopUp = createModuleHook(PROVIDE_KEY, _usePopUp)
