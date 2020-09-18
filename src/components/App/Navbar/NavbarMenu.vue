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
        @click="onItemClick(data.options.name)"
        @action="$emit('action', $event)"
      ></NavbarItem>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import NavbarItem from './NavbarItem.vue'
import { NavbarItemData } from './navbar'

export default defineComponent({
  name: 'NavbarMenu',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    navbarItemDataList: {
      type: Array as PropType<NavbarItemData[]>,
      required: true
    }
  },
  components: {
    NavbarItem
  },
  setup (props, context) {
    const isOpen = computed({
      get () {
        return props.value
      },
      set (newValue: boolean) {
        context.emit('input', newValue)
      }
    })

    const onItemClick = (itemName: string) => {
      if (itemName !== 'menuToggle') isOpen.value = false
    }

    return {
      isOpen,
      onItemClick
    }
  }
})
</script>
