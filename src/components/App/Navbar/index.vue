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
      <icon-fa-solid-angle-left />
    </div>
    <div
      v-show="isOverflow"
      class="overflow-right-container"
      @click="onArrowRightClick"
    >
      <icon-fa-solid-angle-right />
    </div>

    <NavbarMenu
      :navbar-item-data-list="menuNavbarItemDataList"
    ></NavbarMenu>

    <NavbarItemList
      :navbar-item-data-list="navbarItemDataList"
    ></NavbarItemList>
  </nav>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref, provide, onMounted } from 'vue'
import NavbarMenu from './NavbarMenu.vue'
import NavbarItemList from './NavbarItemList.vue'
import { useNavbarItems } from './navbar'
import { useBreakpoints } from '@/modules/breakpoints'
import { useScrollLock } from '@/modules/scroll-lock'
import { useWindowSize, isClient } from '@vueuse/core'

export default defineComponent({
  name: 'Navbar',
  components: {
    NavbarMenu,
    NavbarItemList
  },
  setup () {
    const { lockScroll, unlockScroll } = useScrollLock()
    const { smAndUp, xsOnly } = useBreakpoints()
    const { width: windowWidth } = useWindowSize()

    const isMenuOpen = ref(false)
    watch(isMenuOpen, (bool) => {
      bool ? lockScroll() : unlockScroll()
    })
    provide('isMenuOpen', isMenuOpen)

    const isMounted = ref(false)
    const isOverflow = computed(() => {
      if (xsOnly.value) return false
      return windowWidth.value < ((isClient && isMounted.value)
        ? (document.querySelector('#navbar .navbar-item-list')?.scrollWidth ?? 0)
        : 0)
    })

    const fullNavbarItemDataList = useNavbarItems()

    const menuNavbarItemDataList = computed(() => {
      return fullNavbarItemDataList.value.filter(data => !data.options.hiddenInMenu)
    })

    const navbarItemDataList = computed(() => {
      if (smAndUp.value) {
        return fullNavbarItemDataList.value
          .filter((data) => data.options.name !== 'menuToggle')
      }
      return fullNavbarItemDataList.value.filter(data => data.options.fixedInNavbar)
    })

    watch(xsOnly, (bool) => {
      if (!bool) {
        isMenuOpen.value = false
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
      isMounted.value = true
    })

    return {
      isMenuOpen,
      isOverflow,
      menuNavbarItemDataList,
      navbarItemDataList,
      onArrowLeftClick,
      onArrowRightClick
    }
  }
})
</script>
