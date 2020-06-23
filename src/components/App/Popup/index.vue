<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <div v-show="popupService.isPopup" id="popup" @click="onClose">
    <component :is="popupContainerComponent" @close="onClose">
      <component
        :is="popupContentComponent"
        :popup-content-data="popupService.popupData.contentData"
      ></component>
    </component>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import GeneralPopupContent from '@/components/App/Popup/Content/GeneralPopupContent.vue'
import EmptyPopupContent from '@/components/App/Popup/Content/EmptyPopupContent.vue'
import DefaultPopupContainer from '@/components/App/Popup/Container/DefaultPopupContainer.vue'
import { PopupService, PopupContentType, PopupContainerType } from '@/services/popup'
import { injectedThis } from '@/utils/common'

function injected (thisArg: unknown) {
  return injectedThis<{
    popupService: PopupService;
  }>(thisArg)
}

export default Vue.extend({
  name: 'Popup',
  inject: ['popupService'],
  components: {
    DefaultPopupContainer,
    EmptyPopupContent,
    GeneralPopupContent
  },
  computed: {
    popupContainerComponent () {
      return {
        [PopupContainerType.Default]: DefaultPopupContainer
      }[injected(this).popupService.popupData.containerType]
    },
    popupContentComponent () {
      return {
        [PopupContentType.Empty]: EmptyPopupContent,
        [PopupContentType.General]: GeneralPopupContent
      }[injected(this).popupService.popupData.contentData.type]
    }
  },
  methods: {
    onClose () {
      injected(this).popupService.close()
    }
  }
})
</script>

<style scoped="">
</style>
