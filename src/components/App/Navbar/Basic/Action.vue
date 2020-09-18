<template>
  <div class="navbar-item-container" @click="$emit('click', $event)">
    <button class="navbar-item action" @click="$emit('action', action)">
      <NavbarItemContent>
        <template v-slot:prefix>
          <slot name="prefix" v-bind="$props"> </slot>
        </template>

        <template v-slot:default>
          <slot name="default" v-bind="$props">
            <span v-text="text"> </span>
          </slot>
        </template>

        <template v-slot:suffix>
          <slot name="suffix" v-bind="$props"> </slot>
        </template>
      </NavbarItemContent>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import NavbarItemContent from './NavbarItemContent.vue'

export default defineComponent({
  name: 'Action',
  components: {
    NavbarItemContent
  },
  props: {
    text: {
      type: String,
      required: false,
      default: ''
    },
    action: {
      type: String,
      required: true
    },
    payloads: {
      type: Object as PropType<{ [key: string]: unknown }>,
      required: false
    }
  },
  setup () {
    return {}
  }
})
</script>
