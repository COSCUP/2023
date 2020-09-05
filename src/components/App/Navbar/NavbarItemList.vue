<template>
  <div class="navbar-item-list">
    <NavbarItem
      v-for="data in navbarItemDataList"
      :key="data.options.name"
      :navbar-item-data="data"
      @click="onItemClick(data.options.name)"
      @action="$emit('action', $event)"
    ></NavbarItem>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api'
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
  },
  setup (props, context) {
    const onItemClick = (itemName: string) => {
      if (itemName === 'menuToggle') context.emit('toggle-menu')
    }

    return {
      onItemClick
    }
  }
})
</script>
