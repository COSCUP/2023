<template>
  <div class="navbar-item-container">
    <button class="navbar-item action">
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
import { defineComponent } from 'vue'
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
    }
  }
})
</script>
