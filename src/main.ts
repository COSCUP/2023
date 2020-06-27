// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import App from './App.vue'
import Icon from '@/components/Basic/Icon/index.vue'
import { RenderedEventDispatcher } from '@/plugins/renderedEventDispatcher'
import { createRouter } from '@/router'
import { createRootInjections } from '@/utils/common'

Vue.use(RenderedEventDispatcher)
Vue.use(VueCompositionAPI)

Vue.component('Icon', Icon)

Vue.config.productionTip = false

const rootInjections = createRootInjections()

const router = createRouter(rootInjections)

const root = new Vue({
  provide: rootInjections,
  router,
  render: h => h(App)
})

document.addEventListener('DOMContentLoaded', () => {
  root.$mount('#app')
})
