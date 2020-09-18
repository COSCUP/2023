<template>
  <Action v-bind="$attrs">
    <template v-slot:default="{ payloads }">
      <Icon
        :name="payloads.currentThemeType === 'light' ? 'sun' : 'moon'"
      ></Icon>
    </template>
  </Action>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Action from '../Basic/Action.vue'

export default defineComponent({
  name: 'ThemeToggle',
  components: {
    Action
  },
  setup () {
    return {}
  }
})
</script>
