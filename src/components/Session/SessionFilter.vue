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
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'SessionFilter',
  setup () {
    const { filterOptions, filterValue } = useSession()
    const { t, locale } = useI18n()

    const changeFilterValue = (e:Event) => {
      const { name, value } = e.target as HTMLInputElement

      filterValue.value = { ...filterValue.value, [name]: value }
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
