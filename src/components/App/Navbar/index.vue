<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <nav
    id="navbar"
    :class="{
      overflow: isOverflow
    }"
  >
    <div v-show="isOverflow" class="overflow-left-container">
      <Icon :name="'angle-left'" />
    </div>
    <div v-show="isOverflow" class="overflow-right-container">
      <Icon :name="'angle-right'" />
    </div>
    <div
      class="menu"
      :class="{
        open: isMenuOpen
      }"
    >
      <div class="menu-mask" @click="setMenuOpen(false)"></div>
      <div class="menu-container">
        <NavbarItem
          v-for="navbarItem in navbarItemsInMenu"
          :key="navbarItem.name"
          :navbar-item="navbarItem"
          @action="commitAction"
          @click="setMenuOpen(false)"
        >
          <template v-if="navbarItem.name === 'home'" v-slot:prefix>
            <img class="logo-icon" :src="`/2020/images/logo.svg`" />
          </template>
          <template v-if="navbarItem.name === 'home'" v-slot:default>
            <p style="font-weight: 900;">COSCUP</p>
            <p
              style="font-weight: 300; font-size: 0.75rem; text-align: left; color: var(--color-text);"
            >
              2020
            </p>
          </template>

          <template
            v-else-if="navbarItem.name === 'themeToggle'"
            v-slot:default
          >
            <Icon
              :name="themeService.themeType === 'light' ? 'sun' : 'moon'"
            ></Icon>
          </template>
        </NavbarItem>
      </div>
    </div>
    <div class="items">
      <NavbarItem
        v-for="navbarItem in navbarItemsFixedInNavbar"
        :key="navbarItem.name"
        :navbar-item="navbarItem"
        @action="commitAction"
      >
        <template v-if="navbarItem.name === 'home'" v-slot:prefix>
          <img class="logo-icon" :src="`/2020/images/logo.svg`" />
        </template>
        <template v-if="navbarItem.name === 'home'" v-slot:default>
          <p style="font-weight: 900;">COSCUP</p>
          <p
            style="font-weight: 300; font-size: 0.75rem; text-align: left; color: var(--color-text);"
          >
            2020
          </p>
        </template>

        <template v-else-if="navbarItem.name === 'menuToggle'" v-slot:default>
          <Icon name="bars"></Icon>
        </template>

        <template v-else-if="navbarItem.name === 'themeToggle'" v-slot:default>
          <Icon
            :name="themeService.themeType === 'light' ? 'sun' : 'moon'"
          ></Icon>
        </template>
      </NavbarItem>
    </div>
  </nav>
</template>

<script lang="ts">
import { debounce } from 'lodash-es'
import { defineComponent, ref, computed, watch, onMounted, onBeforeUnmount } from '@vue/composition-api'
import NavbarItem from './NavbarItem.vue'
import { navbarItems, NavbarAction } from './navbar'
import { useBreakpointService } from '@/services/breakpoint'
import { useScrollLockService } from '@/services/scrollLock'
import { useThemeService } from '@/services/theme'

export default defineComponent({
  name: 'Navbar',
  components: {
    NavbarItem
  },
  setup () {
    const breakpointService = useBreakpointService()
    const scrollLockService = useScrollLockService()
    const themeService = useThemeService()
    const isMenuOpen = ref(false)
    const isOverflow = ref(false)
    const navbarItemsInMenu = computed(() => {
      if (breakpointService.smAndUp) return navbarItems
      return navbarItems.filter(item => !item.hiddenInMenu)
    })
    const navbarItemsFixedInNavbar = computed(() => {
      if (breakpointService.smAndUp) return []
      return navbarItems.filter(item => item.fixedInNavbar)
    })
    const setMenuOpen = (isOpen: boolean) => {
      isMenuOpen.value = isOpen
      isOpen ? scrollLockService.lock() : scrollLockService.unlock()
    }
    const commitAction = (action: NavbarAction, args?: never) => {
      const actions: { [action in NavbarAction]: () => void } = {
        [NavbarAction.ToggleMenu]: () => { setMenuOpen(!isMenuOpen.value) },
        [NavbarAction.ToggleTheme]: () => {
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
        document.querySelectorAll('#navbar .menu .navbar-item-container')
      )
        .map(element => element.offsetWidth)
        .reduce((a, b) => a + b, 0)
      isOverflow.value = windowWidth < menuItemTotalWidth
    }, 300)

    watch(() => breakpointService.xsOnly, (newValue: boolean) => {
      if (!newValue) {
        setMenuOpen(false)
      }
    })

    onMounted(() => {
      detectOverflow()
      window.addEventListener('resize', detectOverflow)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', detectOverflow)
    })

    return {
      breakpointService,
      scrollLockService,
      themeService,
      isMenuOpen,
      isOverflow,
      navbarItems,
      navbarItemsInMenu,
      navbarItemsFixedInNavbar,
      setMenuOpen,
      commitAction
    }
  }
})
</script>
