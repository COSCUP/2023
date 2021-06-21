import { setupI18nRoutes } from '@/modules/i18n'
import { RouterOptions } from 'vite-ssg'
import { RouteRecordRaw, RouterScrollBehavior } from 'vue-router'

const routes: RouteRecordRaw[] = import.meta.env.VITE_LANDING_ONLY === 'yes'
  ? [
      {
        path: '/',
        name: 'Home',
        redirect: {
          name: 'Landing'
        },
        meta: {
          order: 0
        }
      },
      {
        path: '/landing',
        name: 'Landing',
        component: () => import('@/pages/Landing.vue')
      },
      {
        path: '/session',
        name: 'Session',
        component: () => import('@/pages/Session.vue'),
        children: [
          {
            path: ':sessionId',
            name: 'SessionDetail',
            component: () => import('@/pages/Session.vue')
          }
        ],
        meta: {
          order: 1
        }
      }
    ]
  : [
      {
        path: '/',
        name: 'Home',
        component: () => import('@/pages/Home.vue'),
        meta: {
          order: 0
        }
      },
      {
        path: '/landing',
        name: 'Landing',
        component: () => import('@/pages/Landing.vue')
      },
      {
        path: '/session',
        name: 'Session',
        component: () => import('@/pages/Session.vue'),
        children: [
          {
            path: ':sessionId',
            name: 'SessionDetail',
            component: () => import('@/pages/Session.vue')
          }
        ],
        meta: {
          order: 1
        }
      },
      // {
      //   path: '/room',
      //   name: 'Room',
      //   component: () => import('@/pages/Room.vue'),
      //   meta: {
      //     order: 2
      //   }
      // },
      // {
      //   path: '/map',
      //   name: 'Map',
      //   component: () => import('@/pages/Map.vue'),
      //   meta: {
      //     order: 3
      //   }
      // },
      // {
      //   path: '/venue',
      //   name: 'Venue',
      //   component: () => import('@/pages/Venue.vue'),
      //   meta: {
      //     order: 4
      //   }
      // },
      {
        path: '/sponsor',
        name: 'Sponsor',
        component: () => import('@/pages/Sponsor.vue'),
        meta: {
          order: 5
        }
      },
      {
        path: '/staff',
        name: 'Staff',
        component: () => import('@/pages/Staff.vue'),
        meta: {
          order: 6
        }
      }, {
        name: 'NotFound',
        path: '/:catchAll(.*)',
        redirect: '/'
      }
    ]

export const pageRouteNameList = routes.filter(r => !isNaN(Number(r.meta?.order)))
  .sort((a, b) => Number(a.meta?.order) - Number(b.meta?.order))
  .map(r => r.name?.toString() ?? '')

export const routerOptions: RouterOptions = {
  base: import.meta.env.BASE_URL,
  routes: setupI18nRoutes(routes),
  scrollBehavior: ((): RouterScrollBehavior => {
    const toTreatAsSame = ['Session', 'SessionDetail']
    const savedPosition: Record<'top' | 'left', number> = {
      top: 0,
      left: 0
    }
    const savePosition = (top: number, left: number) => {
      Object.assign(savedPosition, { top, left })
    }
    return (to, from) => {
      const { scrollX, scrollY } = window
      savePosition(scrollY, scrollX)
      if (to.name === from.name ||
        (toTreatAsSame.includes(to.name?.toString() ?? '') &&
        toTreatAsSame.includes(from.name?.toString() ?? ''))
      ) {
        return savedPosition
      }
      return {
        top: 0,
        left: 0,
        behavior: 'smooth'
      }
    }
  })()
}
