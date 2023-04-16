<template>
  <article class="session-filter">
    <section v-for="filter in filterOptions" :key="filter.label">
      <label>{{ t(`session.filter.${filter.label}`) }}: </label>
      <select v-model="filterValue[filter.label]">
        <option value="*">{{ t("session.filter.all") }}</option>
        <option v-for="option in filter.options" :key="option.id" :value="option.id">
          {{ option.name[locale] }}
        </option>
      </select>
    </section>
  </article>
</template>
<script lang="ts">
import { defineComponent, watch } from 'vue'
import { useSession } from '@/modules/session'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'SessionFilter',
  setup () {
    const { filterOptions, filterValue } = useSession()
    const { t, locale } = useI18n()
    const { query } = useRoute()
    const router = useRouter()

    filterValue.value = { ...filterValue.value, ...query }

    watch(filterValue.value, (value) => {
      const newFilterValue = Object.entries(value).filter(([_, value]) => value !== '*')
      router.push({ query: Object.fromEntries(newFilterValue), replace: true })
    })

    return {
      filterOptions,
      filterValue,
      locale,
      t
    }
  }
})

</script>
