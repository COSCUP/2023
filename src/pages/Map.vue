<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main id="map" class="page-container">
    Map
  </main>
</template>

<script lang="ts">
import Vue from 'vue'

import '@/assets/scss/pages/map.scss'

export default Vue.extend({
  name: 'Map',
  components: {
  },
  mounted () {
    this.$dispatchRenderedEvent()
  }
})
</script>
