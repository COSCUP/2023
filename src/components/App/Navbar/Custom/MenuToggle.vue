<template>
  <component :is="Action" v-bind="$attrs" @click="isOpen = !isOpen">
    <template v-slot:default>
      <icon-fa-solid-bars />
    </template>
  </component>
</template>

<script lang="ts">
import { defineComponent, inject, Ref } from 'vue'
import Action from '../Basic/Action.vue'

export default defineComponent({
  name: 'MenuToggle',
  setup () {
    const isOpen = inject<Ref<boolean>>('isMenuOpen')
    if (!isOpen) throw new Error('"isMenuOpen" is not provided')

    return {
      Action,
      isOpen
    }
  }
})
</script>
