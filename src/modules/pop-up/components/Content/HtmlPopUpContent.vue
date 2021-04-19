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
import { usePopUp } from '@/modules/pop-up'
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'GeneralPopupContent',
  setup () {
    const { currentPopUp } = usePopUp()
    const html = computed(() => {
      if (currentPopUp.value?.contentData.type !== 'html') {
        throw new Error('Invalid popup content data for "GeneralPopUpContent" component.')
      }

      return currentPopUp.value.contentData.html
    })

    return {
      html
    }
  }
})
</script>
