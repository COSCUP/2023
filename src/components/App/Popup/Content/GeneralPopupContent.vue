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
import { defineComponent, computed } from '@vue/composition-api'
import { PopupContentType } from '@/services/popup'
import { usePopupService } from '@/services/hooks'

export default defineComponent({
  name: 'GeneralPopupContent',
  setup () {
    const popupService = usePopupService()
    const html = computed(() => {
      if (popupService.popupData.contentData.type === PopupContentType.General) {
        return popupService.popupData.contentData.html
      }
      throw new Error('Invalid popup content data for "GeneralPopupContent" component.')
    })

    return {
      html
    }
  }
})
</script>
