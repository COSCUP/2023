<template>
  <div class="navbar-item-content">
    <div class="navbar-item__prefix">
      <slot name="prefix"></slot>
    </div>
    <div class="navbar-item__content">
      <slot name="default"> </slot>
    </div>
    <div class="navbar-item__suffix">
      <slot name="suffix"> </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NavbarItemContent',
  setup () {
    return {}
  }
})
</script>
