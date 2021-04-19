<template>
  <div
    class="navbar-menu"
    :class="{
      open: isOpen,
    }"
  >
    <div class="menu-mask" @click="isOpen = false"></div>
    <div class="menu-container">
      <NavbarItem
        v-for="data in navbarItemDataList"
        :key="data.options.name"
        :navbar-item-data="data"
        @click="isOpen = false"
      ></NavbarItem>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, inject, Ref } from 'vue'
import NavbarItem from './NavbarItem.vue'
import { NavbarItemData } from './navbar'

export default defineComponent({
  name: 'NavbarMenu',
  props: {
    navbarItemDataList: {
      type: Array as PropType<NavbarItemData[]>,
      required: true
    }
  },
  components: {
    NavbarItem
  },
  setup (props, { emit }) {
    const isOpen = inject<Ref<boolean>>('isMenuOpen')
    if (!isOpen) throw new Error('"isMenuOpen" is not provided')

    return {
      isOpen
    }
  }
})
</script>
