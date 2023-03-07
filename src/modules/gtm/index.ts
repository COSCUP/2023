import { UserModuleInstall } from '@/modules/types'
import { createGtm } from '@gtm-support/vue-gtm'

export const install: UserModuleInstall = ({ app, router }) => {
  if (!import.meta.env.VITE_GTM_ID) return
  if (!import.meta.env.PROD) return

  app.use(createGtm({
    id: import.meta.env.VITE_GTM_ID.toString(),
    vueRouter: router
  }))
}
