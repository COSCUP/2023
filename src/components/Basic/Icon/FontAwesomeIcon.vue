<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <FontAwesomeIconOriginal :icon="iconValue"></FontAwesomeIconOriginal>
</template>

<script lang="ts">
import { FontAwesomeIcon as FontAwesomeIconOriginal } from '@fortawesome/vue-fontawesome'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
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
