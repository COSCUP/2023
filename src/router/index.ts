// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { camelCase } from 'lodash-es'
import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { FullPageProgressService } from '@/services/fullPageProgress'
import { LanguageService, LanguageType, defaultLanguageType, availableLanguageTypes } from '@/services/language'
import { MetaService } from '@/services/meta'
import { PopupService } from '@/services/popup'
import { delay } from '@/utils/common'
import { scrollTo } from '@/utils/scrollTo'
import { inject } from '@vue/composition-api'

Vue.use(VueRouter)

const pageRoutes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home'
  },
  {
    path: '/agenda',
    name: 'Agenda',
    children: [
      {
        path: ':sessionId',
        name: 'AgendaDetail'
      }
    ]
  },
  {
    path: '/venue',
    name: 'Venue'
  },
  {
    path: '/map',
    name: 'Map'
  },
  {
    path: '/sponsor',
    name: 'Sponsor'
  },
  {
    path: '/staff',
    name: 'Staff'
  }
].filter((route: RouteConfig) => process.env.NODE_ENV === 'development' || !['Map'].includes(route.name || ''))

export const pageRouteNameList: Array<string> = pageRoutes.map((route) => route.name as string)

interface Inject {
  metaService: MetaService;
  languageService: LanguageService;
  fullPageProgressService: FullPageProgressService;
  popupService: PopupService;
}

export function createRouter (injects: Inject): VueRouter {
  const { languageService, fullPageProgressService, metaService, popupService } = injects

  const PageComponent: { [name: string]: () => Promise<typeof import('*.vue')> } = {
    Home: () => import(
      /* webpackChunkName: "home" */
      /* webpackPrefetch: true */
      '@/pages/Home.vue'),
    Agenda: () => import(
      /* webpackChunkName: "agenda" */
      /* webpackPrefetch: true */
      '@/pages/Agenda.vue'),
    Venue: () => import(
      /* webpackChunkName: "venue" */
      /* webpackPrefetch: true */
      '@/pages/Venue.vue'),
    Map: () => import(
      /* webpackChunkName: "map" */
      /* webpackPrefetch: true */
      '@/pages/Map.vue'),
    Sponsor: () => import(
      /* webpackChunkName: "sponsor" */
      /* webpackPrefetch: true */
      '@/pages/Sponsor.vue'),
    Staff: () => import(
      /* webpackChunkName: "staff" */
      /* webpackPrefetch: true */
      '@/pages/Staff.vue')
  }

  pageRoutes.forEach((route) => {
    route.component = async () => {
      let didLoad = false
      delay(100).then(() => {
        didLoad || (fullPageProgressService.setStatus(true))
      })
      const component = await PageComponent[route.name as string]().then((component) => {
        didLoad = true
        return component
      })
      if (fullPageProgressService.isLoading) {
        await delay(300)
        fullPageProgressService.setStatus(false)
      }
      return component
    }
  })

  const routes: Array<RouteConfig> = [
    ...pageRoutes
  ]

  const expandedRoutes: Array<RouteConfig> = []

  // map original routes to redirection routes
  expandedRoutes.push(...routes.map((route) => ({
    path: route.path,
    redirect: `/${defaultLanguageType}${route.path}`
  })))

  // map original routes to multi-language routes
  expandedRoutes.push(...routes.map((route) => ({
    ...route,
    path: `/:languageType${route.path}`
  })))

  expandedRoutes.push({
    name: 'NotFound',
    path: '*',
    redirect (to) {
      const languageType = to.params.languageType
      return {
        path: languageType ? `/${languageType}/` : '/'
      }
    }
  })

  let mySavedPosition: { x: number; y: number } = { x: 0, y: 0 }

  const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: expandedRoutes,
    scrollBehavior (to, from, savedPosition) {
      setTimeout(() => {
        if (savedPosition) {
          return { x: 0, y: 0 }
        } else if (to.name === from.name) {
          const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
          const { cancel } = scrollTo({
            from: isSafari ? mySavedPosition : { x: 0, y: 0 },
            to: mySavedPosition
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

      mySavedPosition = {
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
