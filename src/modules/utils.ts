import { isClient } from '@vueuse/core'
import { getCurrentInstance, inject, InjectionKey } from 'vue'
import { useRouter } from 'vue-router'
import { SetupContext } from './types'

export function useProvided<T> (key: string | InjectionKey<T>) {
  const provided = inject<T>(key)
  if (!provided) throw new Error(`"${key}" is not provided`)
  return provided
}

export function useSetupCtx (): SetupContext {
  return {
    app: getCurrentInstance()!.appContext.app,
    router: useRouter(),
    isClient
  }
}

export function createModuleSetup<T> (PROVIDE_KEY: InjectionKey<T>, setup: (...args: any[]) => T, fallback?: T) {
  return (...args: any[]) => {
    let provided
    const { app, isClient } = useSetupCtx()
    if (!isClient && fallback) provided = fallback
    else provided = setup(...args)
    app.provide(PROVIDE_KEY, provided)
    return provided
  }
}

export function createModuleHook<T> (PROVIDE_KEY: InjectionKey<T>, setup: (...args: any[]) => T, fallback?: T) {
  return (...args: any[]) => {
    let provided = inject(PROVIDE_KEY)
    if (provided) return provided
    const { app, isClient } = useSetupCtx()
    if (!isClient && fallback) provided = fallback
    else provided = setup(...args)
    app.provide(PROVIDE_KEY, provided)
    return provided
  }
}
