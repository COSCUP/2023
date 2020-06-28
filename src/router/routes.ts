import { RouteConfig } from 'vue-router'
import { FullPageProgressService } from '@/services/fullPageProgress'
import { delay } from '@/utils/common'
import { defaultLanguageType } from '@/services/language'

const originalRoutes: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import(
      /* webpackChunkName: "home" */
      /* webpackPrefetch: true */
      '@/pages/Home.vue'),
    meta: {
      type: 'page'
    }
  },
  {
    path: '/agenda',
    name: 'Agenda',
    children: [
      {
        path: ':sessionId',
        name: 'AgendaDetail'
      }
    ],
    component: () => import(
      /* webpackChunkName: "agenda" */
      /* webpackPrefetch: true */
      '@/pages/Agenda.vue'),
    meta: {
      type: 'page'
    }
  },
  {
    path: '/venue',
    name: 'Venue',
    component: () => import(
      /* webpackChunkName: "venue" */
      /* webpackPrefetch: true */
      '@/pages/Venue.vue'),
    meta: {
      type: 'page'
    }
  },
  {
    path: '/map',
    name: 'Map',
    component: () => import(
      /* webpackChunkName: "map" */
      /* webpackPrefetch: true */
      '@/pages/Map.vue'),
    meta: {
      type: 'page'
    }
  },
  {
    path: '/sponsor',
    name: 'Sponsor',
    component: () => import(
      /* webpackChunkName: "sponsor" */
      /* webpackPrefetch: true */
      '@/pages/Sponsor.vue'),
    meta: {
      type: 'page'
    }
  },
  {
    path: '/staff',
    name: 'Staff',
    component: () => import(
      /* webpackChunkName: "staff" */
      /* webpackPrefetch: true */
      '@/pages/Staff.vue'),
    meta: {
      type: 'page'
    }
  }
]
  // filtered routes for production
  .filter((route: RouteConfig) => {
    return process.env.NODE_ENV === 'development' || !['Map'].includes(route.name || '')
  })

export const pageRouteNameList: Array<string> = originalRoutes
  .filter((route) => route.meta && route.meta.type === 'page')
  .map((route) => route.name as string)

export function createRoutes (fullPageProgressService: FullPageProgressService): RouteConfig[] {
  const finalRoutes: RouteConfig[] = []

  // inject fullPageProgress loading feature for pages
  originalRoutes
    .filter((route) => route.meta && route.meta.type === 'page')
    .forEach((route) => {
      const importComponent = route.component as (() => Promise<typeof import('*.vue')>)
      route.component = async () => {
        let didLoad = false
        let ifSetLoading = false
        delay(100)
          .then(() => {
            didLoad || (() => {
              fullPageProgressService.setStatus(true)
              ifSetLoading = true
            })()
          })
        const component = await importComponent()
        didLoad = true

        if (ifSetLoading) {
          await delay(300)
          fullPageProgressService.setStatus(false)
        }

        return component
      }
    })

  // map original routes to redirection routes
  finalRoutes.push(...originalRoutes.map((route) => ({
    path: route.path,
    redirect: `/${defaultLanguageType}${route.path}`
  })))

  // map original routes to multi-language routes
  finalRoutes.push(...originalRoutes.map((route) => ({
    ...route,
    path: `/:languageType${route.path}`
  })))

  // add fallback route
  finalRoutes.push({
    name: 'NotFound',
    path: '*',
    redirect (to) {
      const languageType = to.params.languageType
      return {
        path: languageType ? `/${languageType}/` : '/'
      }
    }
  })

  return finalRoutes
}
