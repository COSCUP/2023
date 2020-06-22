<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <div id="default-popup-container" class="popup-container">
    <div class="inner-container">
      <button class="close" @click="$emit('close')">
        <Icon name="times"></Icon>
      </button>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'DefaultPopupContainer'
})
</script>

<style scoped>
</style>
