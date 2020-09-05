<template>
  <Action v-bind="$attrs" v-on="$listeners">
    <template v-slot:default>
      <Icon name="bars"></Icon>
    </template>
  </Action>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
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
