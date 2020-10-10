// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { camelCase } from 'lodash'
import { Router, createRouter as _createRouter, createWebHistory, RouteLocationNormalized } from 'vue-router'
import { LanguageType, defaultLanguageType, availableLanguageTypes, LanguagePack } from '@/services/language'
import { MetaOptions } from '@/services/meta'
import { createRoutes, pageRouteNameList } from './routes'
import { delay } from '@/utils/common'

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

  const router = _createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,

    async scrollBehavior (to, from) {
      const toKeepPositionConditions: ((to: RouteLocationNormalized, from: RouteLocationNormalized) => boolean)[] = [
        (to, from) => to.name === from.name && to.params.languageType !== from.params.languageType,
        (to, from) => to.name === from.name && (to.query.popUp === 'announcement' || from.query.popUp === 'announcement'),
        (to, from) => (to.name === 'Agenda' && from.name === 'AgendaDetail') || (to.name === 'AgendaDetail' && from.name === 'Agenda')
      ]
      if (toKeepPositionConditions.some((condition) => condition(to, from))) return
      await delay(300)
      return {
        top: 0,
        left: 0
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
