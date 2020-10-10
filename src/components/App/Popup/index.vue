<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <div v-if="isPopup" id="popup" @click.self="onClose">
    <component :is="popupContainerComponent" @close="onClose">
      <component :is="popupContentComponent"></component>
    </component>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import GeneralPopupContent from '@/components/App/Popup/Content/GeneralPopupContent.vue'
import EmptyPopupContent from '@/components/App/Popup/Content/EmptyPopupContent.vue'
import DefaultPopupContainer from '@/components/App/Popup/Container/DefaultPopupContainer.vue'
import SessionPopupContainer from '@/components/App/Popup/Container/SessionPopupContainer.vue'
import { useStore } from '@/store'

export default defineComponent({
  name: 'Popup',
  setup () {
    const { isPopup, popupData, closePopup } = useStore()
    const popupContainerComponent = computed(() => {
      return {
        default: DefaultPopupContainer,
        session: SessionPopupContainer
      }[popupData.value.containerData.type]
    })
    const popupContentComponent = computed(() => {
      return {
        empty: EmptyPopupContent,
        general: GeneralPopupContent
      }[popupData.value.contentData.type]
    })
    const onClose = () => {
      closePopup()
    }

    return {
      isPopup,
      popupContainerComponent,
      popupContentComponent,
      onClose
    }
  }
})
</script>

<style scoped="">
</style>
