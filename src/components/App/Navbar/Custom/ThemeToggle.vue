<template>
  <component :is="Action" v-bind="$attrs" @click="switchColorSchema">
    <template v-slot:default>
      <icon-ic-round-brightness-2 v-if="colorSchema === 'dark'"  style="font-size: 1.25rem;"/>
      <icon-ic-round-brightness-7 v-else-if="colorSchema === 'light'"  style="font-size: 1.25rem;"/>
      <icon-ic-round-brightness-auto v-else  style="font-size: 1.25rem;"/>
    </template>
  </component>
</template>

<script lang="ts">
import { useTheme } from '@/modules/theme'
import { defineComponent } from 'vue'
import Action from '../Basic/Action.vue'

export default defineComponent({
  name: 'ThemeToggle',
  setup () {
    const { colorSchema, switchColorSchema } = useTheme()

    return {
      Action,
      colorSchema,
      switchColorSchema
    }
  }
})
</script>
