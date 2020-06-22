<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <FontAwesomeIconOriginal :icon="iconValue"></FontAwesomeIconOriginal>
</template>

<script lang="ts">
import Vue from 'vue'
import { FontAwesomeIcon as FontAwesomeIconOriginal } from '@fortawesome/vue-fontawesome'

export default Vue.extend({
  name: 'FontAwesomeIcon',
  props: {
    iconValue: {
      required: true
    }
  },
  components: {
    FontAwesomeIconOriginal
  }
})
</script>
