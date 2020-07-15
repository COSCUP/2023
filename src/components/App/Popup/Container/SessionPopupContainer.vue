<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <div
    id="session-popup-container"
    class="popup-container"
    @click.self="$emit('close')"
  >
    <div class="inner-container">
      <button class="close" @click="$emit('close')">
        <Icon name="times"></Icon>
      </button>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'SessionPopupContainer'
})
</script>

<style scoped>
</style>
