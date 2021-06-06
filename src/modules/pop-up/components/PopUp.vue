<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <div v-if="currentPopUp" id="popup" @click.self="closePopUp">
    <component :is="currentContainerComponent" @close="closePopUp">
      <component :is="currentContentComponent"></component>
    </component>
  </div>
</template>

<script lang="ts">
import { delay } from '@/utils/common'
import { defineComponent } from 'vue'
import { usePopUp } from '../index'

export default defineComponent({
  name: 'PopUp',
  setup () {
    const { currentPopUp, currentContainerComponent, currentContentComponent, closePopUp } = usePopUp()

    return {
      currentPopUp,
      currentContainerComponent,
      currentContentComponent,
      closePopUp
    }
  },
  async serverPrefetch () {
    // TODO: This is work around way to fix SSG the pop-up component
    // The issue is caused by the order that 'serverPrefetch' hook being calling
    // This component is earlier called than the 'pages/Session.vue'
    // So I just make it delay 1000ms for waiting 'pages/Session.vue' called first
    if (this.$route.name === 'SessionDetail') {
      await delay(1000)
    }
  }
})
</script>
