// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { createApp } from 'vue'
import App from './App.vue'
import Icon from '@/components/Basic/Icon/index.vue'
import { RenderedEventDispatcher } from '@/plugins/renderedEventDispatcher'
import createRootInjections from '@/utils/common/createRootInjections'

const { router, ...rootInjections } = createRootInjections()

const root = createApp(App)
  .use(RenderedEventDispatcher)
  .use(router)
  .component('Icon', Icon)

Object.entries(rootInjections)
  .forEach(([key, value]) => {
    root.provide(key, value)
  })

document.addEventListener('DOMContentLoaded', () => {
  root.mount('#app-outer')
})
