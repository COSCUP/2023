import { computed, watch } from 'vue'
import { RouteRecordRaw, useRouter, RouteLocationNormalized } from 'vue-router'
import { createI18n, I18nOptions, useI18n } from 'vue-i18n'
import { useMetas } from '../metas'
import { UserModuleSetup, UserModuleInstall } from '../types'

export type Locale = 'en' | 'zh-TW'

const messages = (() => {
  const result: Record<string, any> = {}
  Object.entries(import.meta.globEager('../../../locales/**/*.json'))
    .forEach(([key, value]) => {
      const [locale, part] = key.split('/').slice(4).map(s => s.replace('.json', ''))
      result[locale] = result[locale] ?? {}
      result[locale][part] = value.default
    })
  return result
})()
export const locales = Object.keys(messages)

function getFallbackLocale () {
  if (typeof window !== 'object') return 'zh-TW'
  const lang = window.navigator.language
  if (lang.includes('zh')) return 'zh-TW'
  return 'en'
}

const i18nOptions: I18nOptions = {
  legacy: false,
  locale: 'zh-TW',
  fallbackLocale: getFallbackLocale(),
  messages
}

export const setupI18nRoutes = (routes: RouteRecordRaw[]) => {
  // Redirect the original routes to path within default locale
  const redirectRoutes: RouteRecordRaw[] = [
    ...routes.map((route) => ({
      path: route.path,
      redirect: (to: RouteLocationNormalized) => `/${i18nOptions.fallbackLocale}${to.path}`
    })),
    ...routes
      .filter((route) => route.children)
      .map((route) =>
        route.children?.map((child) => ({
          path: `${route.path}/${child.path}`,
          redirect: (to: RouteLocationNormalized) => `/${i18nOptions.fallbackLocale}${to.path}`
        })) ?? []
      ).flat()
  ]

  // Map original routes to routes with locale parameter and navigation guard
  const extendedRoutes: RouteRecordRaw[] = routes.map((route) => ({
    ...route,
    path: `/:locale${route.path}`,
    beforeEnter (to, from, next) {
      if (locales.includes(to.params.locale?.toString() ?? '')) {
        next()
        return
      }
      next(`/${i18nOptions.fallbackLocale}${to.path}`)
    }
  }))

  return [
    ...redirectRoutes,
    ...extendedRoutes
  ]
}

export const install: UserModuleInstall = ({ app }) => {
  const i18n = createI18n<I18nOptions>(i18nOptions)
  app.use(i18n)
}

export const setup: UserModuleSetup = () => {
  const { locale, fallbackLocale } = useI18n()
  const { lang } = useMetas()
  const router = useRouter()

  watch(router.currentRoute, (route) => {
    locale.value = route.params.locale?.toString() ?? fallbackLocale.value
  }, {
    immediate: true
  })

  watch(locale, (val) => {
    lang.value = val
  })
}

export const useNextLocale = () => {
  const { availableLocales, locale } = useI18n()
  return computed<string>(() => {
    const currentIndex = availableLocales.indexOf(locale.value)
    const nextIndex = (currentIndex + 1) % availableLocales.length
    return availableLocales[nextIndex]
  })
}
