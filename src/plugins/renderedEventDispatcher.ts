import { App, inject } from 'vue'

export const RenderedEventDispatcher = {
  install (app: App) {
    const dispatch = () => { document.dispatchEvent(new Event('x-app-rendered')) }
    app.config.globalProperties.$dispatchRenderedEvent = dispatch
    app.provide('dispatchRenderedEvent', dispatch)
  }
}

export function useRenderedEventDispatcher () {
  const dispatchRenderedEvent = inject<(() => void)>('dispatchRenderedEvent')
  if (!dispatchRenderedEvent) {
    throw new Error('RenderedEventDispatcher is not provided')
  }
  return dispatchRenderedEvent
}
