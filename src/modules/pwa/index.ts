import { useRegisterSW } from 'virtual:pwa-register/vue'
import { InjectionKey } from 'vue'
import { createModuleSetup, useSetupCtx } from '../utils'

const PROVIDE_KEY: InjectionKey<ReturnType<typeof useRegisterSW> | false> = Symbol('pwa-register')

const _useRegisterSW = () => {
  const { isClient, router } = useSetupCtx()
  if (!isClient) { return false }

  router.isReady().then(async () => {
    const { registerSW } = await import('virtual:pwa-register')
    registerSW({
      immediate: true,
      onRegistered (r) {
        if (!r) return
        console.log('onRegistered')
        r.update()
        setInterval(() => { r.update() }, 60 * 60 * 1000)
      }
    })
  })
}

export const setup = createModuleSetup(PROVIDE_KEY, _useRegisterSW)
