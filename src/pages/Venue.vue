<template>
  <main id="venue" class="page-container">
    Venue
  </main>
</template>

<script lang="ts">
import Vue from 'vue'

import '@/assets/scss/pages/venue.scss'

export default Vue.extend({
  name: 'Venue',
  components: {
  },
  mounted () {
    this.$emit('render')
  }
})
</script>
