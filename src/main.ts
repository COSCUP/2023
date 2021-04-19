// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import App from './App.vue'
import { routerOptions } from '@/router'
import { ViteSSG } from 'vite-ssg'
import { installModules } from '@/modules'

if (globalThis.window) {
  window.rootUrl = `${import.meta.env.VITE_ORIGIN}${import.meta.env.BASE_URL}`
}

export const createApp = ViteSSG(
  // the root component
  App,
  // vue-router options
  routerOptions,
  // function to have custom setups
  (ctx) => {
    installModules(ctx)
  }
)
