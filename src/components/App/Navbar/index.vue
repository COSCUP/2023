<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <nav
    id="navbar"
    :class="{
      overflow: isOverflow,
    }"
  >
    <div
      v-show="isOverflow"
      class="overflow-left-container"
      @click="onArrowLeftClick"
    >
      <Icon :name="'angle-left'" />
    </div>
    <div
      v-show="isOverflow"
      class="overflow-right-container"
      @click="onArrowRightClick"
    >
      <Icon :name="'angle-right'" />
    </div>

    <NavbarMenu
      :value="isMenuOpen"
      @input="setMenuOpen"
      @action="commitAction"
      :navbar-item-data-list="menuNavbarItemDataList"
    ></NavbarMenu>

    <NavbarItemList
      :navbar-item-data-list="navbarItemDataList"
      @action="commitAction"
    ></NavbarItemList>
  </nav>
</template>

<script lang="ts">
import { debounce } from 'lodash'
import { defineComponent, computed, watch, onMounted, onBeforeUnmount, reactive, toRefs } from '@vue/composition-api'
import NavbarItem from './NavbarItem.vue'
import NavbarMenu from './NavbarMenu.vue'
import NavbarItemList from './NavbarItemList.vue'
import { useBreakpointService, useScrollLockService, useThemeService, useLanguageService } from '@/services/hooks'
import { getInternalLinkDataList, getExternalLinkDataList, getLanguageSwitchData, getThemeToggleData, getMenuToggleData, ActionType } from './navbar'
import { useRouter } from '@/router'

export default defineComponent({
  name: 'Navbar',
  components: {
    NavbarItem,
    NavbarMenu,
    NavbarItemList
  },
  setup () {
    const router = useRouter()
    const breakpointService = useBreakpointService()
    const languageService = useLanguageService()
    const scrollLockService = useScrollLockService()
    const themeService = useThemeService()
    const data = reactive({
      isMenuOpen: false,
      isOverflow: false
    })

    const getNavbarItemText = (itemName) => languageService.languagePack.app.navbar[itemName]

    const internalLinkDataList = computed(() => {
      return getInternalLinkDataList({
        currentRoute: router.currentRoute,
        getNavbarItemText
      })
    })

    const externalLinksDataList = computed(() => {
      return getExternalLinkDataList({
        getNavbarItemText
      })
    })

    const languageSwitchData = computed(() => {
      return getLanguageSwitchData({
        currentLanguageType: languageService.languageType,
        currentRoute: router.currentRoute,
        getNextLanguageTypeText: (nextLanguageType) =>
          languageService.languagePackSet[nextLanguageType].app.navbar.languageSwitch
      })
    })

    const themeToggleData = computed(() => {
      return getThemeToggleData({
        currentThemeType: themeService.themeType
      })
    })

    const menuToggleData = getMenuToggleData()

    const fullNavbarItemDataList = computed(() => [
      ...internalLinkDataList.value,
      ...externalLinksDataList.value,
      languageSwitchData.value,
      themeToggleData.value,
      menuToggleData
    ])

    const menuNavbarItemDataList = computed(() => {
      return fullNavbarItemDataList.value.filter(data => !data.options.hiddenInMenu)
    })

    const navbarItemDataList = computed(() => {
      if (breakpointService.smAndUp) {
        return fullNavbarItemDataList.value
          .filter((data) => data.options.name !== 'menuToggle')
      }
      return fullNavbarItemDataList.value.filter(data => data.options.fixedInNavbar)
    })

    const setMenuOpen = (isOpen: boolean) => {
      data.isMenuOpen = isOpen
      isOpen ? scrollLockService.lock() : scrollLockService.unlock()
    }

    const commitAction = (action: ActionType, args?: never) => {
      const actions: { [action in ActionType]: () => void } = {
        'toggle-menu': () => { setMenuOpen(!data.isMenuOpen) },
        'toggle-theme': () => {
          themeService.themeType = themeService.themeType === 'light' ? 'dark' : 'light'
          themeService.savePreference()
        }
      }
      if (!actions[action]) return
      actions[action].apply(null, args || [])
    }

    const detectOverflow = debounce(() => {
      if (breakpointService.xsOnly) return
      const windowWidth = window.innerWidth
      const menuItemTotalWidth = Array.from<HTMLElement>(
        document.querySelectorAll('#navbar .navbar-item-list .navbar-item-container')
      )
        .map(element => element.offsetWidth)
        .reduce((a, b) => a + b, 0)
      data.isOverflow = windowWidth < menuItemTotalWidth
    }, 300)

    watch(() => breakpointService.xsOnly, (newValue: boolean) => {
      if (!newValue) {
        setMenuOpen(false)
      }
    })

    const scrollNavbar = (deltaX: number) => {
      const el = document.querySelector('#navbar .navbar-item-list')
      if (!el) return
      const scrollLeft = el.scrollLeft
      el.scrollTo({
        left: scrollLeft + deltaX,
        behavior: 'smooth'
      })
    }

    const onArrowLeftClick = () => {
      scrollNavbar(-150)
    }

    const onArrowRightClick = () => {
      scrollNavbar(150)
    }

    onMounted(() => {
      detectOverflow()
      window.addEventListener('resize', detectOverflow)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', detectOverflow)
    })

    return {
      ...toRefs(data),
      breakpointService,
      scrollLockService,
      themeService,
      menuNavbarItemDataList,
      navbarItemDataList,
      setMenuOpen,
      commitAction,
      onArrowLeftClick,
      onArrowRightClick
    }
  }
})
</script>
