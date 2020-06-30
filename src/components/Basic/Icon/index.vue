<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <component :is="iconComponent" :icon-value="icon.value" />
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import FontAwesomeIcon from './FontAwesomeIcon.vue'
import { icons, IconSource } from '@/utils/icon'

type IconComponent = typeof FontAwesomeIcon

export default defineComponent({
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
  setup (props) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const icon = computed(() => icons.find((icon) => icon.name === props.name)!)
    const iconComponent = computed(() => {
      const componentMap: { [source in IconSource]: IconComponent } = {
        fontAwesome: FontAwesomeIcon
      }
      return componentMap[icon.value.source]
    })

    return {
      icon,
      iconComponent
    }
  }
})
</script>
