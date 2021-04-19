<template>
  <div class="navbar-item-list">
    <NavbarItem
      v-for="data in navbarItemDataList"
      :key="data.options.name"
      :navbar-item-data="data"
    ></NavbarItem>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import NavbarItem from './NavbarItem.vue'
import { NavbarItemData } from './navbar'

export default defineComponent({
  name: 'NavbarItemList',
  props: {
    navbarItemDataList: {
      type: Array as PropType<NavbarItemData[]>,
      required: true
    }
  },
  components: {
    NavbarItem
  }
})
</script>
