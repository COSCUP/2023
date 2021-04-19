<template>
  <div ref="main" class="main-container" :class="classes">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { useScrollLock } from '@/modules/scroll-lock'
import { usePopUp } from '@/modules/pop-up'
import { useCssVar } from '@vueuse/core'
import { computed, defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'MainContainer',
  setup () {
    const { isScrollLocked, scrollLockedPosition } = useScrollLock()
    const { currentPopUp } = usePopUp()

    const main = ref<HTMLElement | null>(null)
    const currentScrollX = useCssVar('--current-scroll-x', main)
    const currentScrollY = useCssVar('--current-scroll-y', main)
    watch(scrollLockedPosition, (position) => {
      if (position === null) {
        currentScrollX.value = ''
        currentScrollY.value = ''
        return
      }
      currentScrollX.value = `${position.x}px`
      currentScrollY.value = `${position.y}px`
    }, {
      immediate: true
    })

    const classes = computed(() => ({
      'scroll-lock': isScrollLocked.value,
      'pop-up': currentPopUp.value !== null
    }))

    return {
      classes,
      main
    }
  }
})
</script>
