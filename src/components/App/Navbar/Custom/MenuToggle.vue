<template>
  <Action v-bind="$attrs">
    <template v-slot:default>
      <Icon name="bars"></Icon>
    </template>
  </Action>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Action from '../Basic/Action.vue'

export default defineComponent({
  name: 'MenuToggle',
  components: {
    Action
  },
  setup () {
    return {}
  }
})
</script>
