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
    <MainContainer>
      <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transitionName" mode="out-in">
          <keep-alive>
            <component :is="Component"></component>
          </keep-alive>
        </transition>
      </router-view>
      <template v-if="!isLandingPage">
        <Footer></Footer>
      </template>
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
import { FullPageProgress } from '@/modules/progress'
import { PopUp } from '@/modules/pop-up'

import '@/assets/scss/app.scss'

export default defineComponent({
  name: 'App',
  components: {
    MainContainer,
    Navbar,
    SponsorFooter,
    Footer,
    FullPageProgress,
    PopUp
  },
  setup () {
    setupModules()
    const route = useRoute()

    const isInApp = ref(false)
    const isLandingPage = computed(() => route.name === 'Landing')

    watch(() => route.query, ({ mode }) => {
      isInApp.value || (isInApp.value = mode === 'app')
    }, {
      immediate: true
    })

    return {
      isLandingPage,
      isInApp
    }
  }
})
</script>
