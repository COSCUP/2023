<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <section
    id="general-popup-content"
    v-html="html"
    class="popup-content"
  ></section>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'GeneralPopupContent',
  setup () {
    const { popupData } = useStore()
    const html = computed(() => {
      if (popupData.value.contentData.type === 'general') {
        return popupData.value.contentData.html
      }
      throw new Error('Invalid popup content data for "GeneralPopupContent" component.')
    })

    return {
      html
    }
  }
})
</script>
