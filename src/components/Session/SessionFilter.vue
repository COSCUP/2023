<template>
  <article class="session-filter">
    <section v-for="filter in filterOptions" :key="filter.label">
      <label>{{ t(`session.filter.${filter.label}`) }}: </label>
      <select :name="filter.label" :value="filterValue[filter.label]" @change="changeFilterValue">
        <option value="*">{{ t("session.filter.all") }}</option>
        <option v-for="option in filter.options" :key="option.id" :value="option.id">
          {{ option.name[locale] }}
        </option>
      </select>
    </section>
  </article>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useSession } from '@/modules/session'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'SessionFilter',
  setup () {
    const { filterOptions, filterValue, handleFilterValueChange } = useSession()
    const { t, locale } = useI18n()
    const router = useRouter()

    const changeFilterValue = (e:Event) => {
      const target = e.target as HTMLInputElement
      const value = target.value
      const label = target.name

      handleFilterValueChange(label, value)
      const newFilterValue = Object.entries(filterValue.value).filter(([_, value]) => value !== '*')
      const query = Object.fromEntries(newFilterValue) as Record<string, string>

      router.push({ query, replace: true })
    }

    return {
      filterOptions,
      filterValue,
      locale,
      changeFilterValue,
      t
    }
  }
})

</script>
