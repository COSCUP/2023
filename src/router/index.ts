import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { LanguageManager, LanguageType, defaultLanguageType, availableLanguageTypes } from '@/utils/language'
import { FullPageProgressManager } from '@/utils/fullPageProgress'
import { delay } from '@/utils/common'
import { MetaManager } from '@/utils/meta'
import { camelCase } from 'lodash-es'

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
]

export const pageRouteNameList: Array<string> = pageRoutes.map((route) => route.name as string)

interface Inject {
  metaManager: MetaManager;
  languageManager: LanguageManager;
  fullPageProgressManager: FullPageProgressManager;
}

export function createRouter (injects: Inject): VueRouter {
  const { languageManager, fullPageProgressManager, metaManager } = injects

  const PageComponent: { [name: string]: () => Promise<typeof import('*.vue')> } = {
    Home: () => import(/* webpackChunkName: "home" */ '@/pages/Home.vue'),
    Agenda: () => import(/* webpackChunkName: "agenda" */ '@/pages/Agenda.vue'),
    Venue: () => import(/* webpackChunkName: "venue" */ '@/pages/Venue.vue'),
    Map: () => import(/* webpackChunkName: "map" */ '@/pages/Map.vue'),
    Sponsor: () => import(/* webpackChunkName: "sponsor" */ '@/pages/Sponsor.vue'),
    Staff: () => import(/* webpackChunkName: "staff" */ '@/pages/Staff.vue')
  }

  pageRoutes.forEach((route) => {
    route.component = async () => {
      let didLoad = false
      delay(100).then(() => {
        didLoad || (fullPageProgressManager.setStatus(true))
      })
      const component = await PageComponent[route.name as string]().then((component) => {
        didLoad = true
        return component
      })
      if (fullPageProgressManager.isLoading) {
        await delay(300)
        fullPageProgressManager.setStatus(false)
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

  const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: expandedRoutes,
    scrollBehavior (to) {
      if (to.hash) {
        const target = document.querySelector(CSS.escape(to.hash)) as HTMLElement

        return window.scrollTo({
          top: target.offsetTop,
          left: target.offsetLeft,
          behavior: 'smooth'
        })
      }
    }
  })

  router.beforeEach((to, from, next) => {
    const languageType = to.params.languageType
    if (languageType && !(availableLanguageTypes as string[]).includes(languageType)) {
      next('/')
    } else {
      languageManager.languageType = languageType as LanguageType || defaultLanguageType

      const routeName = to.name ?? ''
      if (pageRouteNameList.includes(routeName)) {
        type LanguagePackKeys = Exclude<(keyof typeof languageManager.languagePack), 'app'>
        metaManager.resetMeta()
        metaManager.setMeta({
          title: languageManager.languagePack[camelCase(routeName) as LanguagePackKeys].meta.title
        })
      }
      next()
    }
  })

  return router
}
