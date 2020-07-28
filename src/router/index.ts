// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { camelCase } from 'lodash'
import Vue from 'vue'
import VueRouter from 'vue-router'
import { LanguageType, defaultLanguageType, availableLanguageTypes, LanguagePack } from '@/services/language'
import { MetaOptions } from '@/services/meta'
import { scrollTo, Position } from '@/utils/scrollTo'
import { inject } from '@vue/composition-api'
import { createRoutes, pageRouteNameList } from './routes'

export { pageRouteNameList } from './routes'

Vue.use(VueRouter)

type PageTitleKey = Exclude<(keyof LanguagePack), 'app'>
interface MethodInject {
  setLanguageType: (languageType: LanguageType) => void;
  setIsLoading: (isLoading: boolean) => void;
  setMeta: (options: MetaOptions) => void;
  getPageTitle: (pageTitleKey: PageTitleKey) => string;
  isPopup: () => boolean;
}

export function createRouter (inject: MethodInject): VueRouter {
  const routes = createRoutes(inject.setIsLoading)

  let prevPosition: Position = { x: 0, y: 0 }
  const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
    scrollBehavior (to, from, savedPosition) {
      setTimeout(() => {
        if (to.name === from.name) {
          const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
          const { cancel } = scrollTo({
            from: isSafari ? prevPosition : { x: 0, y: 0 },
            to: prevPosition
          })
          const events = ['wheel', 'mousewheel', 'DOMMouseScroll']
          const onScrolling = () => {
            events.forEach((event) => window.removeEventListener(event, onScrolling))
            cancel()
          }
          events.forEach((event) => window.addEventListener(event, onScrolling))
        } else if (inject.isPopup()) {
          const popupDom = document.getElementById('popup')
          popupDom && popupDom.scrollTo(0, 0)
        } else {
          return savedPosition ?? { x: 0, y: 0 }
        }
      })
    }
  })

  router.beforeEach((to, from, next) => {
    const languageType = to.params.languageType
    if (languageType && !(availableLanguageTypes as string[]).includes(languageType)) {
      next('/')
    } else {
      inject.setLanguageType(languageType as LanguageType || defaultLanguageType)

      const routeName = to.name ?? ''
      if (pageRouteNameList.includes(routeName)) {
        inject.setMeta({
          title: inject.getPageTitle(camelCase(routeName) as PageTitleKey)
        })
      }

      prevPosition = {
        x: window.scrollX,
        y: window.scrollY
      }
      next()
    }
  })

  return router
}

export function useRouter (): VueRouter {
  const router = inject<VueRouter>('router')
  if (!router) throw new Error('"router" is not provided')
  return router
}
