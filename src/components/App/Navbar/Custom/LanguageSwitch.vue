<template>
  <!-- <component :is="InternalLink" v-bind="$attrs" :to="nextLocaleRoute"> -->
  <component :is="InternalLink" v-bind="$attrs" :to="nextLocaleRoute">
    <template v-slot:default>
      <icon-clarity-language-solid style="font-size: 1.5rem;"/>
    </template>
  </component>
</template>

<script lang="ts">
import { useNextLocale } from '@/modules/i18n'
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import InternalLink from '../Basic/InternalLink.vue'

export default defineComponent({
  name: 'LanguageSwitch',
  setup () {
    const { getLocaleMessage } = useI18n()
    const nextLocale = useNextLocale()
    const nextLocaleText = computed(() => (getLocaleMessage(nextLocale.value) as any).app.navbar.languageSwitch as string)
    const nextLocaleRoute = computed(() => {
      return {
        params: {
          locale: nextLocale.value
        }
      }
    })
    return {
      InternalLink,
      nextLocaleText,
      nextLocaleRoute
    }
  }
})
</script>
