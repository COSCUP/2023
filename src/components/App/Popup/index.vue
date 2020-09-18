<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <div v-if="popupService.isPopup" id="popup" @click.self="onClose">
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
import { usePopupService } from '@/services/hooks'

export default defineComponent({
  name: 'Popup',
  components: {
    // DefaultPopupContainer,
    // SessionPopupContainer,
    // EmptyPopupContent,
    // GeneralPopupContent
  },
  setup () {
    const popupService = usePopupService()
    const popupContainerComponent = computed(() => {
      return {
        default: DefaultPopupContainer,
        session: SessionPopupContainer
      }[popupService.popupData.containerData.type]
      // return DefaultPopupContainer
    })
    const popupContentComponent = computed(() => {
      return {
        empty: EmptyPopupContent,
        general: GeneralPopupContent
      }[popupService.popupData.contentData.type]
      // return EmptyPopupContent
    })
    const onClose = () => {
      popupService.close()
    }

    const waa = () => { console.log('waa') }

    return {
      popupService,
      popupContainerComponent,
      popupContentComponent,
      onClose,
      waa
    }
  }
})
</script>

<style scoped="">
</style>
