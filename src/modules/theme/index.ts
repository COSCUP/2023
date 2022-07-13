import { watch, computed, Ref, ref, InjectionKey } from 'vue'
import { usePreferredDark, useStorage } from '@vueuse/core'
import { createModuleHook, useSetupCtx } from '../utils'

type ColorSchema = 'auto' | 'dark' | 'light'

interface UseTheme {
  isDark: Ref<boolean>;
  colorSchema: Ref<ColorSchema>;
  switchColorSchema: () => void;
}
const PROVIDE_KEY: InjectionKey<UseTheme> = Symbol('theme')
const fallback: UseTheme = {
  isDark: ref(false),
  colorSchema: ref('auto'),
  switchColorSchema: () => {}
}

const _useTheme = (): UseTheme => {
  const { isClient } = useSetupCtx()
  const order: ColorSchema[] = ['auto', 'dark', 'light']
  const preferredDark = usePreferredDark()
  const colorSchema = useStorage('color-schema', 'auto') as Ref<ColorSchema>
  const isDark = computed(() => colorSchema.value === 'auto'
    ? preferredDark.value
    : colorSchema.value === 'dark')
  const switchColorSchema = () => {
    colorSchema.value = order[(order.indexOf(colorSchema.value) + 1) % order.length]
  }

  const changeBarStyle = () => {
    const head = document.querySelector('head')

    const meta = document.querySelector('meta[name=theme-color]') ?? document.createElement('meta')
    meta.setAttribute('name', 'theme-color')
    meta.setAttribute('content', isDark.value ? '#1a4b6d' : '#fff')
    if (!meta.parentElement && head) {
      head?.appendChild(meta)
    }

    const meta2 = document.querySelector('meta[name=apple-mobile-web-app-status-bar-style]') ?? document.createElement('meta')
    meta2.setAttribute('name', 'apple-mobile-web-app-status-bar-style')
    meta2.setAttribute('content', `${isDark.value ? 'dark' : 'light'}-content`)
    if (!meta2.parentElement && head) {
      head?.appendChild(meta2)
    }
  }

  isClient && watch(
    isDark,
    v => {
      document.documentElement.classList.toggle('dark', v)
      document.documentElement.classList.toggle('light', !v)
      changeBarStyle()
    },
    { immediate: true }
  )

  return {
    colorSchema,
    isDark,
    switchColorSchema
  }
}

// export const setup = createModuleSetup(PROVIDE_KEY, _useTheme, fallback)
export const useTheme = createModuleHook(PROVIDE_KEY, _useTheme, fallback)
