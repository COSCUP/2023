<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <div :class="{
    'in-app': isInApp,
  }">
    <Navbar></Navbar>
    <OfflineBar></OfflineBar>
    <MainContainer>
      <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transitionName" mode="out-in">
          <keep-alive>
            <component :is="Component"></component>
          </keep-alive>
        </transition>
      </router-view>
      <template v-if="!landingOnly">
        <SponsorFooter></SponsorFooter>
      </template>
      <Footer></Footer>
    </MainContainer>
    <FullPageProgress></FullPageProgress>
    <PopUp></PopUp>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { setupModules } from '@/modules'
import MainContainer from '@/components/App/MainContainer.vue'
import Navbar from '@/components/App/Navbar/index.vue'
import SponsorFooter from '@/components/App/SponsorFooter.vue'
import Footer from '@/components/App/Footer.vue'
import OfflineBar from '@/components/App/OfflineBar.vue'
import { FullPageProgress } from '@/modules/progress'
import { PopUp } from '@/modules/pop-up'
import { registerSW } from 'virtual:pwa-register'

import '@/assets/scss/app.scss'

export default defineComponent({
  name: 'App',
  components: {
    MainContainer,
    Navbar,
    SponsorFooter,
    Footer,
    FullPageProgress,
    PopUp,
    OfflineBar
  },
  setup () {
    setupModules()
    const route = useRoute()
    registerSW({ immediate: true })

    const isInApp = ref(false)
    const landingOnly = import.meta.env.VITE_LANDING_ONLY === 'yes'
    const isLandingPage = computed(() => route.name === 'Landing')

    watch(() => route.query, ({ mode }) => {
      isInApp.value || (isInApp.value = mode === 'app')
    }, {
      immediate: true
    })

    return {
      isLandingPage,
      isInApp,
      landingOnly
    }
  }
})
</script>
