<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <div
    id="app"
    :class="{
      'in-app': isInApp
    }"
  >
    <Navbar v-if="!isInApp"></Navbar>
    <div
      :class="{
        'scroll-lock': scrollLockService.isLocked,
        popupped: popupService.isPopup
      }"
      :style="{
        '--current-scroll-x': `${scrollLockService.currentScrollPosition.x}px`,
        '--current-scroll-y': `${scrollLockService.currentScrollPosition.y}px`
      }"
      class="main-container"
    >
      <transition :name="pageTransitionName" mode="out-in">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
      <SponsorFooter></SponsorFooter>
      <Footer></Footer>
    </div>
    <FullPageProgress v-show="fullPageProgressService.isLoading">
    </FullPageProgress>
    <Popup></Popup>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, onMounted, nextTick, onBeforeUnmount, watch } from '@vue/composition-api'
import { Location } from 'vue-router'
import Navbar from '@/components/App/Navbar/index.vue'
import SponsorFooter from '@/components/App/SponsorFooter.vue'
import Footer from '@/components/App/Footer.vue'
import FullPageProgress from '@/components/App/FullPageProgress.vue'
import Popup from '@/components/App/Popup/index.vue'
import { useRouter, pageRouteNameList } from '@/router'
import { useAnnouncementService, useBreakpointService, useFullPageProgressService, useLanguageService, usePopupService, useThemeService, useScrollLockService } from '@/services/hooks'
import { provideRenderedEventDispatcher } from './plugins/renderedEventDispatcher'

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
    provideRenderedEventDispatcher()

    const router = useRouter()
    const languageService = useLanguageService()
    const themeService = useThemeService()
    const breakpointService = useBreakpointService()
    const scrollLockService = useScrollLockService()
    const fullPageProgressService = useFullPageProgressService()
    const popupService = usePopupService()
    const announcementService = useAnnouncementService()

    const isInApp = ref(false)
    const pageTransitionName: Ref<'slide-left' | 'slide-right' | 'fade'> = ref('fade')

    const updatePageTransitionName = (newRouteName: string, oldRouteName: string) => {
      if (breakpointService.xsOnly) {
        pageTransitionName.value = 'fade'
        return
      }

      const newIndex = pageRouteNameList.indexOf(newRouteName)
      const oldIndex = pageRouteNameList.indexOf(oldRouteName)
      if (oldIndex < newIndex) {
        pageTransitionName.value = 'slide-left'
      } else {
        pageTransitionName.value = 'slide-right'
      }
    }

    const detectAnnouncementRoute = () => {
      if (router.currentRoute.query.popUp === 'announcement') {
        const onClose: () => void = () => {
          const query = { ...router.currentRoute.query }
          delete query.popUp
          router.push({
            ...(router.currentRoute as Location),
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
            ...router.currentRoute.query,
            popUp: 'announcement'
          }
        })
      }
    }

    const onAppRender = () => {
      setTimeout(() => {
        detectAnnouncementUpdate()
      }, 1000)
    }

    // TODO: Fix the page transition
    watch(() => router.currentRoute, (route, prevRoute) => {
      updatePageTransitionName(route.name ?? '', prevRoute.name ?? '')
      detectAnnouncementRoute()
    })

    onMounted(async () => {
      document.addEventListener('x-app-rendered', onAppRender)
      breakpointService.startDetect()
      themeService.startDetect()
      await nextTick()
      isInApp.value = router.currentRoute.query.mode === 'app'
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
      isInApp,
      pageTransitionName
    }
  }
})
</script>
