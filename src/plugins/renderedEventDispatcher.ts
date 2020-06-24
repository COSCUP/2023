import { VueConstructor } from 'vue'

export const RenderedEventDispatcher = {
  install (Vue: VueConstructor) {
    Vue.prototype.$dispatchRenderedEvent = function () {
      document.dispatchEvent(new Event('x-app-rendered'))
    }
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $dispatchRenderedEvent: () => void;
  }
}
