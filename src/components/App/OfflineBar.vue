<template>
  <teleport v-if="offline" to="body">
    <div id="offline" class="base">{{ t('app.offline') }}</div>
  </teleport>
</template>

<script lang="ts">
import { useSetupCtx } from '@/modules/utils'
import { defineComponent, onBeforeMount, onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'OfflineBar',
  setup () {
    const { isClient } = useSetupCtx()
    const { t } = useI18n()

    const offline = ref(isClient ? !window.navigator.onLine : false)

    const listener = () => {
      offline.value = isClient ? !window.navigator.onLine : false
    }

    onBeforeMount(() => {
      if (!isClient) return
      window.addEventListener('online', listener)
      window.addEventListener('offline', listener)
    })

    onBeforeUnmount(() => {
      if (!isClient) return
      window.removeEventListener('online', listener)
      window.removeEventListener('offline', listener)
    })

    return {
      t,
      offline
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/shared/_index";

@mixin offline-theme-colors {
  @include theme-colors-of("light", "#offline") {
    --color-background: #{$coscup-blue};
  }

  @include theme-colors-of("dark", "#offline") {
    --color-background: #{$coscup-green};
  }
}

@include offline-theme-colors;

.base {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 5;
  padding: 5px;
  color: #fff;
  background-color: var(--color-background);
  font-size: 0.9rem;
  text-align: center;
}
</style>
