<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <div v-show="isLoading" id="full-page-progress">
    <div class="lds-ripple">
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<script lang="ts">
import { useProgress } from '../index'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FullPageProgress',
  setup () {
    const { isLoading } = useProgress()

    return {
      isLoading
    }
  }
})
</script>
