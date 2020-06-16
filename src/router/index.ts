import Vue from 'vue'
import VueRouter, { RouteConfig, RawLocation, Route } from 'vue-router'
import { LanguageManager, LanguageType, defaultLanguageType, availableLanguageTypes } from '@/utils/language'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = (() => {
  const fallbackRedirect: ((to: Route) => RawLocation) = (to) => {
    const languageType = to.params.languageType
    return {
      path: languageType ? `/${languageType}/` : '/'
    }
  }

  const routes: Array<RouteConfig> = [
    {
      path: '/',
      name: 'Home',
      component: () => import(/* webpackChunkName: "home" */ '@/pages/Home.vue')
    },
    {
      path: '/agenda',
      name: 'Agenda',
      component: () => import(/* webpackChunkName: "agenda" */ '@/pages/Agenda.vue')
    },
    {
      path: '/venue',
      name: 'Venue',
      component: () => import(/* webpackChunkName: "venue" */ '@/pages/Venue.vue')
    },
    {
      path: '/map',
      name: 'Map',
      component: () => import(/* webpackChunkName: "map" */ '@/pages/Map.vue')
    },
    {
      path: '/sponsor',
      name: 'Sponsor',
      component: () => import(/* webpackChunkName: "sponsor" */ '@/pages/Sponsor.vue')
    },
    {
      path: '/staff',
      name: 'Staff',
      component: () => import(/* webpackChunkName: "staff" */ '@/pages/Staff.vue')
    }
  ]

  const finalRoutes: Array<RouteConfig> = [
    ...routes.map((route) => ({
      path: route.path,
      redirect: `/${defaultLanguageType}${route.path}`
    })),
    ...routes.map((route) => ({
      ...route,
      path: `/:languageType${route.path}`,
      name: route.name,
      component: route.component
    })),
    {
      name: 'NotFound',
      path: '*',
      redirect: fallbackRedirect
    }
  ]

  return finalRoutes
})()

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
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

export function registerLanguageBeforeEachGuard (languageManager: LanguageManager) {
  router.beforeEach((to, from, next) => {
    const languageType = to.params.languageType
    if (languageType && !(availableLanguageTypes as string[]).includes(languageType)) {
      next('/')
    } else {
      languageManager.languageType = languageType as LanguageType || defaultLanguageType
      next()
    }
  })
}

export default router
