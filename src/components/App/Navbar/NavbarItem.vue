<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <component
    :class="{
      [className]: true,
      active: navbarItemData.options.active,
    }"
    :is="navbarItemData.component"
    v-bind="navbarItemData.options"
    v-on="$listeners"
  ></component>
</template>

<script lang="ts">
import { kebabCase } from 'lodash'
import { NavbarItemData } from './navbar'
import { computed, defineComponent, PropType } from '@vue/composition-api'
export default defineComponent({
  name: 'NavbarItem',
  props: {
    navbarItemData: {
      type: Object as PropType<NavbarItemData>,
      required: true
    }
  },
  setup (props) {
    const className = computed(() => kebabCase(props.navbarItemData.options.name))

    return {
      className
    }
  }
})
</script>
