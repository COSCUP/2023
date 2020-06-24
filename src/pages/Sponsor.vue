<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main id="sponsor" class="page-container">
    Sponsor
  </main>
</template>

<script lang="ts">
import Vue from 'vue'

import '@/assets/scss/pages/sponsor.scss'

export default Vue.extend({
  name: 'Sponsor',
  components: {
  },
  mounted () {
    this.$dispatchRenderedEvent()
  }
})
</script>
