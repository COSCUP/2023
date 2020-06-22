<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <section id="empty-popup-content" class="popup-content"></section>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { EmptyPopupContentData, PopupContentType } from '@/services/popup'

export default Vue.extend({
  name: 'EmptyPopupContent',
  props: {
    popupContentData: {
      type: Object as PropType<EmptyPopupContentData>,
      required: true,
      validator (value: EmptyPopupContentData): boolean {
        return value.type && value.type === PopupContentType.Empty
      }
    }
  }
})
</script>
