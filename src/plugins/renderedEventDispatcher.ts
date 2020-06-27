import { VueConstructor } from 'vue'
import { provide, inject } from '@vue/composition-api'

export const RenderedEventDispatcher = {
  install (Vue: VueConstructor) {
    Vue.prototype.$dispatchRenderedEvent = function () {
      document.dispatchEvent(new Event('x-app-rendered'))
    }
  }
}

export function provideRenderedEventDispatcher () {
  provide('dispatchRenderedEvent', () => { document.dispatchEvent(new Event('x-app-rendered')) })
}

export function useRenderedEventDispatcher () {
  const dispatchRenderedEvent = inject<(() => void)>('dispatchRenderedEvent')
  if (!dispatchRenderedEvent) {
    throw new Error('RenderedEventDispatcher is not provided')
  }
  return dispatchRenderedEvent
}

declare module 'vue/types/vue' {
  interface Vue {
    $dispatchRenderedEvent: () => void;
  }
}
