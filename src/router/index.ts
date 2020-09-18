// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { camelCase } from 'lodash'
import { Router, createRouter as _createRouter, createWebHistory } from 'vue-router'
import { LanguageType, defaultLanguageType, availableLanguageTypes, LanguagePack } from '@/services/language'
import { MetaOptions } from '@/services/meta'
import { scrollTo, Position } from '@/utils/scrollTo'
import { createRoutes, pageRouteNameList } from './routes'

export { pageRouteNameList } from './routes'

type PageTitleKey = Exclude<(keyof LanguagePack), 'app'>
interface MethodInject {
  setLanguageType: (languageType: LanguageType) => void;
  setIsLoading: (isLoading: boolean) => void;
  setMeta: (options: MetaOptions) => void;
  getPageTitle: (pageTitleKey: PageTitleKey) => string;
  isPopup: () => boolean;
  isMobile: () => boolean;
}

export function createRouter (inject: MethodInject): Router {
  const routes = createRoutes(inject.setIsLoading)

  let prevPosition: Position = { left: 0, top: 0 }
  const router = _createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,

    scrollBehavior (to, from, savedPosition) {
      if (to.name === from.name) {
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
        const { cancel } = scrollTo({
          from: (isSafari ? prevPosition : { left: 0, top: 0 }) as Position,
          to: prevPosition
        })
        const events = ['wheel', 'mousewheel', 'DOMMouseScroll']
        const onScrolling = () => {
          events.forEach((event) => window.removeEventListener(event, onScrolling))
          cancel()
        }
        events.forEach((event) => window.addEventListener(event, onScrolling))
      } else if (inject.isPopup()) {
        const popupDom = document.querySelector('#popup')
        popupDom && popupDom.scrollTo(0, 0)
      } else {
        return savedPosition ?? { left: 0, top: 0 }
      }
    }
  })

  router.beforeEach((to, from, next) => {
    const languageType = to.params.languageType as string
    if (languageType && !(availableLanguageTypes as string[]).includes(languageType)) {
      next('/')
    } else {
      inject.setLanguageType(languageType as LanguageType || defaultLanguageType)

      const routeName = to.name?.toString() ?? ''
      if (pageRouteNameList.includes(routeName)) {
        inject.setMeta({
          title: inject.getPageTitle(camelCase(routeName) as PageTitleKey)
        })
      }

      prevPosition = {
        left: window.scrollX,
        top: window.scrollY
      }
      next()
    }
  })

  router.afterEach((to, from) => {
    if (inject.isMobile()) {
      to.meta.transitionName = 'fade'
      return
    }
    const newRouteName = to.name?.toString() ?? ''
    const oldRouteName = from.name?.toString() ?? ''
    const newIndex = pageRouteNameList.indexOf(newRouteName)
    const oldIndex = pageRouteNameList.indexOf(oldRouteName)
    if (oldIndex < newIndex) {
      to.meta.transitionName = 'slide-left'
    } else {
      to.meta.transitionName = 'slide-right'
    }
  })

  return router
}
