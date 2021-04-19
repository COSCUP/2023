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
  }
})
</script>
