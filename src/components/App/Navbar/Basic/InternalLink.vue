<template>
  <div class="navbar-item-container" @click="$emit('click', $event)">
    <router-link class="navbar-item internal-link" :to="to">
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
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { RawLocation } from 'vue-router'
import NavbarItemContent from './NavbarItemContent.vue'

export default defineComponent({
  name: 'InternalLink',
  components: {
    NavbarItemContent
  },
  props: {
    text: {
      type: String,
      required: false,
      default: ''
    },
    to: {
      type: Object as PropType<RawLocation>,
      required: true
    },
    active: {
      type: Boolean,
      required: true
    }
  },
  setup () {
    return {}
  }
})
</script>
