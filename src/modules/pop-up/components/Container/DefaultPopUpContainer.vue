<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <div
    id="default-popup-container"
    class="popup-container"
    @click.self="$emit('close')"
  >
    <div class="inner-container">
      <button class="close" @click="$emit('close')">
        <icon-fa-solid-times/>
      </button>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DefaultPopupContainer'
})
</script>
