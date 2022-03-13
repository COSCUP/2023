import { UserModuleInstall, UserModuleSetup } from '@/modules/types'
import VueGtag, { trackRouter } from 'vue-gtag-next'

export const install: UserModuleInstall = ({ app }) => {
  if (!import.meta.env.VITE_GA_ID) return
  if (!import.meta.env.PROD) return

  app.use(VueGtag, {
    property: {
      id: import.meta.env.VITE_GA_ID
    }
  })
}

export const setup: UserModuleSetup = ({ router }) => {
  trackRouter(router, {
    template: (to) => ({
      page_title: to.name,
      page_path: import.meta.env.BASE_URL + to.path,
      page_location: window.location.href
    })
  })
}
