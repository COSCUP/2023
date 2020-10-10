// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import 'setimmediate'
import { createApp } from 'vue'
import App from './App.vue'
import Icon from '@/components/Basic/Icon/index.vue'
import { RenderedEventDispatcher } from '@/plugins/renderedEventDispatcher'
import { Router } from 'vue-router'
import { createRouter } from './router'
import { createStore } from './store'

const store = createStore()

const router: Router = createRouter({
  setIsLoading: (isLoading) => store.setFullPageProgressStatus(isLoading),
  setLanguageType: (languageType) => { store.setLanguageType(languageType) },
  setMeta: (options) => store.setMeta(options),
  getPageTitle: (key) => store.languagePack.value[key].meta.title,
  isPopup: () => store.isPopup.value,
  isMobile: () => store.xsOnly.value
})

const root = createApp(App)
  .use(RenderedEventDispatcher)
  .use(router)
  .use(store)
  .component('Icon', Icon)

// Object.entries(services)
//   .forEach(([key, value]) => {
//     root.provide(key, value)
//   })

document.addEventListener('DOMContentLoaded', () => {
  root.mount('#app-outer')
})
