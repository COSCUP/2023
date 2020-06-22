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
      </NavbarItem>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
import NavbarItem from './NavbarItem.vue'
import { navbarItems, NavbarItemData, NavbarAction } from './navbar'
import { BreakpointService } from '@/services/breakpoint'
import { ScrollLockService } from '@/services/scrollLock'
import { injectedThis } from '@/utils/common'
import { debounce } from 'lodash-es'

function injected (thisArg: unknown) {
  return injectedThis<{
    breakpointService: BreakpointService;
    scrollLockService: ScrollLockService;
  }>(thisArg)
}

export default Vue.extend({
  name: 'Navbar',
  inject: ['breakpointService', 'scrollLockService'],
  components: {
    NavbarItem
  },
  computed: {
    navbarItemsInMenu (): NavbarItemData[] {
      if (injected(this).breakpointService.smAndUp) return this.navbarItems
      return this.navbarItems.filter(item => !item.hiddenInMenu)
    },
    navbarItemsFixedInNavbar (): NavbarItemData[] {
      if (injected(this).breakpointService.smAndUp) return []
      return this.navbarItems.filter(item => item.fixedInNavbar)
    }
  },
  data () {
    return {
      isMenuOpen: false,
      isOverflow: false,
      debouncedDetectOverflow: () => {
        /**/
      },
      navbarItems
    }
  },
  methods: {
    commitAction (action: NavbarAction, args?: never) {
      const actions: { [action in NavbarAction]: Function } = {
        [NavbarAction.ToggleMenu]: () => { this.setMenuOpen(!this.isMenuOpen) }
      }
      if (!actions[action]) return
      actions[action].apply(this, args)
    },
    setMenuOpen (isOpen: boolean) {
      this.isMenuOpen = isOpen
      isOpen ? injected(this).scrollLockService.lock() : injected(this).scrollLockService.unlock()
    },
    detectOverflow () {
      if (injected(this).breakpointService.xsOnly) return
      const windowWidth = window.innerWidth
      const menuItemTotalWidth = Array.from<HTMLElement>(
        document.querySelectorAll('#navbar .menu .navbar-item-container')
      )
        .map(element => element.offsetWidth)
        .reduce((a, b) => a + b, 0)
      this.isOverflow = windowWidth < menuItemTotalWidth
    }
  },
  watch: {
    xsOnly (newValue: boolean) {
      if (!newValue) {
        this.setMenuOpen(false)
      }
    }
  },
  mounted () {
    this.debouncedDetectOverflow = debounce(this.detectOverflow, 300)
    this.debouncedDetectOverflow()
    window.addEventListener('resize', this.debouncedDetectOverflow)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.debouncedDetectOverflow)
  }
})
</script>
