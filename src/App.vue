<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <div
    id="app"
    :class="{
      'in-app': isInApp,
    }"
  >
    <Navbar></Navbar>
    <div
      :class="{
        'scroll-lock': scrollLockService.isLocked,
        popupped: popupService.isPopup,
      }"
      :style="{
        '--current-scroll-x': `${scrollLockService.currentScrollPosition.x}px`,
        '--current-scroll-y': `${scrollLockService.currentScrollPosition.y}px`,
      }"
      class="main-container"
    >
      <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transitionName" mode="out-in">
          <keep-alive>
            <component :is="Component"></component>
          </keep-alive>
        </transition>
      </router-view>
      <SponsorFooter></SponsorFooter>
      <Footer></Footer>
    </div>
    <FullPageProgress v-show="fullPageProgressService.isLoading">
    </FullPageProgress>
    <Popup></Popup>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, watch, reactive, toRefs, nextTick } from 'vue'
import { useRouter, RouteLocationNormalized } from 'vue-router'
import Navbar from '@/components/App/Navbar/index.vue'
import SponsorFooter from '@/components/App/SponsorFooter.vue'
import Footer from '@/components/App/Footer.vue'
import FullPageProgress from '@/components/App/FullPageProgress.vue'
import Popup from '@/components/App/Popup/index.vue'
import { useAnnouncementService, useBreakpointService, useFullPageProgressService, useLanguageService, usePopupService, useThemeService, useScrollLockService } from '@/services/hooks'

import '@/assets/scss/app.scss'

export default defineComponent({
  name: 'App',
  components: {
    Navbar,
    SponsorFooter,
    Footer,
    FullPageProgress,
    Popup
  },
  setup () {
    const router = useRouter()
    const languageService = useLanguageService()
    const themeService = useThemeService()
    const breakpointService = useBreakpointService()
    const scrollLockService = useScrollLockService()
    const fullPageProgressService = useFullPageProgressService()
    const popupService = usePopupService()
    const announcementService = useAnnouncementService()

    const data = reactive({
      isInApp: false
    })

    const detectAnnouncementRoute = () => {
      if (router.currentRoute.value.query.popUp === 'announcement') {
        const onClose: () => void = () => {
          const query = { ...router.currentRoute.value.query }
          delete query.popUp
          router.push({
            ...(router.currentRoute.value),
            query
          })
        }
        announcementService.showAnnouncement(onClose)
      }
    }

    const detectAnnouncementUpdate = () => {
      if (announcementService.hasUpdated) {
        router.push({
          query: {
            ...router.currentRoute.value.query,
            popUp: 'announcement'
          }
        })
      }
    }

    const onRouteChange = (to: RouteLocationNormalized) => {
      data.isInApp || (data.isInApp = to.query.mode === 'app')
      data.isInApp || detectAnnouncementRoute()
    }

    const onAppRender = () => {
      setTimeout(() => {
        data.isInApp || detectAnnouncementUpdate()
      }, 1000)
    }

    watch(() => router.currentRoute.value, onRouteChange)

    onMounted(async () => {
      document.addEventListener('x-app-rendered', onAppRender)
      breakpointService.startDetect()
      themeService.startDetect()
      await nextTick()
      onRouteChange(router.currentRoute.value)
    })

    onBeforeUnmount(() => {
      breakpointService.stopDetect()
      themeService.stopDetect()
    })

    return {
      languageService,
      fullPageProgressService,
      scrollLockService,
      popupService,
      ...toRefs(data)
    }
  }
})
</script>
