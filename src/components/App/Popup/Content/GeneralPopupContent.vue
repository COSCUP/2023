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
import Vue, { PropType } from 'vue'
import { GeneralPopupContentData, PopupContentType } from '@/utils/popup'

export default Vue.extend({
  name: 'GeneralPopupContent',
  props: {
    popupContentData: {
      type: Object as PropType<GeneralPopupContentData>,
      required: true,
      validator (value: GeneralPopupContentData): boolean {
        return value.type && value.type === PopupContentType.General
      }
    }
  },
  computed: {
    html (): string {
      return this.popupContentData.html
    }
  }
})
</script>
