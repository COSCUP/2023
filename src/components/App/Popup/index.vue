<template>
  <div v-show="popupManager.isPopup" id="popup">
    <component :is="popupContainerComponent" @close="onClose">
      <component
        :is="popupContentComponent"
        :popup-content-data="popupManager.popupContentData"
      ></component>
    </component>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import GeneralPopupContent from '@/components/App/Popup/Content/GeneralPopupContent.vue'
import EmptyPopupContent from '@/components/App/Popup/Content/EmptyPopupContent.vue'
import DefaultPopupContainer from '@/components/App/Popup/Container/DefaultPopupContainer.vue'
import { PopupManager, PopupContentType, PopupContainerType } from '@/utils/popup'
import { injectedThis } from '@/utils/common'

function injected (thisArg: unknown) {
  return injectedThis<{
    popupManager: PopupManager;
  }>(thisArg)
}

export default Vue.extend({
  name: 'Popup',
  inject: ['popupManager'],
  components: {
    DefaultPopupContainer,
    EmptyPopupContent,
    GeneralPopupContent
  },
  computed: {
    popupContainerComponent () {
      return {
        [PopupContainerType.Default]: DefaultPopupContainer
      }[injected(this).popupManager.popupContainerType]
    },
    popupContentComponent () {
      return {
        [PopupContentType.Empty]: EmptyPopupContent,
        [PopupContentType.General]: GeneralPopupContent
      }[injected(this).popupManager.popupContentData.type]
    }
  },
  methods: {
    onClose () {
      injected(this).popupManager.popupContentData = {
        type: PopupContentType.Empty
      }
    }
  }
})
</script>

<style scoped="">
</style>
