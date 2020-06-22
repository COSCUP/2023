<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <component :is="iconComponent" :icon-value="icon.value" />
</template>

<script lang="ts">
import Vue from 'vue'
import FontAwesomeIcon from './FontAwesomeIcon.vue'
import { icons, IconSource, FontAwesomeIconData } from '@/utils/icon'

type IconComponent = typeof FontAwesomeIcon

export default Vue.extend({
  name: 'Icon',
  components: {
    FontAwesomeIcon
  },
  props: {
    name: {
      type: String,
      required: true,
      validator (value: string): boolean {
        return icons.some((icon) => icon.name === value)
      }
    }
  },
  computed: {
    icon (): FontAwesomeIconData {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.icons.find((icon) => icon.name === this.name)!
    },
    iconComponent (): IconComponent {
      const componentMap: { [source in IconSource]: IconComponent } = {
        fontAwesome: FontAwesomeIcon
      }
      return componentMap[this.icon.source]
    }
  },
  data () {
    return {
      icons
    }
  }
})
</script>
