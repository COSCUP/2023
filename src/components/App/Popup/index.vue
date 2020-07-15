<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <div v-show="popupService.isPopup" id="popup" @click.self="onClose">
    <component :is="popupContainerComponent" @close="onClose">
      <component :is="popupContentComponent"></component>
    </component>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import GeneralPopupContent from '@/components/App/Popup/Content/GeneralPopupContent.vue'
import EmptyPopupContent from '@/components/App/Popup/Content/EmptyPopupContent.vue'
import DefaultPopupContainer from '@/components/App/Popup/Container/DefaultPopupContainer.vue'
import SessionPopupContainer from '@/components/App/Popup/Container/SessionPopupContainer.vue'
import { PopupContentType, PopupContainerType } from '@/services/popup'
import { usePopupService } from '@/services/hooks'

export default defineComponent({
  name: 'Popup',
  components: {
    DefaultPopupContainer,
    SessionPopupContainer,
    EmptyPopupContent,
    GeneralPopupContent
  },
  setup () {
    const popupService = usePopupService()
    const popupContainerComponent = computed(() => {
      return {
        [PopupContainerType.Default]: DefaultPopupContainer,
        [PopupContainerType.Session]: SessionPopupContainer
      }[popupService.popupData.containerData.type]
    })
    const popupContentComponent = computed(() => {
      return {
        [PopupContentType.Empty]: EmptyPopupContent,
        [PopupContentType.General]: GeneralPopupContent
      }[popupService.popupData.contentData.type]
    })
    const onClose = () => {
      popupService.close()
    }

    return {
      popupService,
      popupContainerComponent,
      popupContentComponent,
      onClose
    }
  }
})
</script>

<style scoped="">
</style>
