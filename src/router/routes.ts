import { RouteRecordRaw } from 'vue-router'
import { delay } from '@/utils/common'
import { defaultLanguageType } from '@/services/language'
import { createAsyncPages, InjectLoadingPromiseFunction, pageRoutesNameList } from '@/pages'

export const pageRouteNameList: Array<string> = pageRoutesNameList

export function createRoutes (setIsLoading: (isLoading: boolean) => void): RouteRecordRaw[] {
  const injectLoadingPromise: InjectLoadingPromiseFunction = async (asyncPageComponent) => {
    let didLoad = false
    let ifSetLoading = false
    delay(100)
      .then(() => {
        didLoad || (() => {
          setIsLoading(true)
          ifSetLoading = true
        })()
      })
    const component = await asyncPageComponent()
    didLoad = true

    if (ifSetLoading) {
      await delay(300)
      setIsLoading(false)
    }

    return component
  }
  const pages = createAsyncPages(injectLoadingPromise)
  const finalRoutes: RouteRecordRaw[] = []
  const originalRoutes: RouteRecordRaw[] = [
    {
      path: '/',
      name: 'Home',
      component: pages.home,
      meta: {
        type: 'page'
      }
    },
    {
      path: '/agenda',
      name: 'Agenda',
      component: pages.agenda,
      meta: {
        type: 'page'
      },
      children: [
        {
          path: ':sessionId',
          name: 'AgendaDetail',
          component: pages.agenda
        }
      ]
    },
    {
      path: '/room',
      name: 'Room',
      component: pages.room,
      meta: {
        type: 'page'
      }
    },
    {
      path: '/map',
      name: 'Map',
      component: pages.map,
      meta: {
        type: 'page'
      }
    },
    {
      path: '/venue',
      name: 'Venue',
      component: pages.venue,
      meta: {
        type: 'page'
      }
    },
    {
      path: '/sponsor',
      name: 'Sponsor',
      component: pages.sponsor,
      meta: {
        type: 'page'
      }
    },
    {
      path: '/staff',
      name: 'Staff',
      component: pages.staff,
      meta: {
        type: 'page'
      }
    }
  ]
  // filtered routes for production
  // .filter((route: RouteConfig) => {
  //   return process.env.NODE_ENV === 'development' || !['Map'].includes(route.name || '')
  // })

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
    path: '/:catchAll(.*)',
    redirect (to) {
      const languageType = to.params.languageType
      return {
        path: languageType ? `/${languageType}/` : '/'
      }
    }
  })

  return finalRoutes
}
