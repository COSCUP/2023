// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { camelCase } from 'lodash-es'
import Vue from 'vue'
import VueRouter from 'vue-router'
import { FullPageProgressService } from '@/services/fullPageProgress'
import { LanguageService, LanguageType, defaultLanguageType, availableLanguageTypes } from '@/services/language'
import { MetaService } from '@/services/meta'
import { PopupService } from '@/services/popup'
import { scrollTo, Position } from '@/utils/scrollTo'
import { inject } from '@vue/composition-api'
import { createRoutes, pageRouteNameList } from './routes'

export { pageRouteNameList } from './routes'

Vue.use(VueRouter)

interface Inject {
  metaService: MetaService;
  languageService: LanguageService;
  fullPageProgressService: FullPageProgressService;
  popupService: PopupService;
}

export function createRouter (injects: Inject): VueRouter {
  const { languageService, fullPageProgressService, metaService, popupService } = injects
  const routes = createRoutes(fullPageProgressService)

  let prevPosition: Position = { x: 0, y: 0 }
  const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
    scrollBehavior (to, from, savedPosition) {
      setTimeout(() => {
        if (savedPosition) {
          return { x: 0, y: 0 }
        } else if (to.name === from.name) {
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
        } else if (popupService.isPopup) {
          const popupDom = document.getElementById('popup')
          popupDom && popupDom.scrollTo(0, 0)
        }
      })
    }
  })

  router.beforeEach((to, from, next) => {
    const languageType = to.params.languageType
    if (languageType && !(availableLanguageTypes as string[]).includes(languageType)) {
      next('/')
    } else {
      languageService.languageType = languageType as LanguageType || defaultLanguageType

      const routeName = to.name ?? ''
      if (pageRouteNameList.includes(routeName)) {
        type LanguagePackKeys = Exclude<(keyof typeof languageService.languagePack), 'app'>
        metaService.setMeta({
          title: languageService.languagePack[camelCase(routeName) as LanguagePackKeys].meta.title
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
