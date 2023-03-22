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
import { defineComponent } from 'vue'
import { useSession } from '@/modules/session'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { assign, pick, omitBy } from 'lodash'

export default defineComponent({
  name: 'SessionFilter',
  setup () {
    const { filterOptions, filterValue } = useSession()
    const { t, locale } = useI18n()
    const { query } = useRoute()

    assign(filterValue.value, pick(query, ['room', 'tags', 'type']))

    return {
      filterOptions,
      filterValue,
      locale,
      t
    }
  },
  updated () {
    const router = useRouter()
    const { filterValue } = useSession()

    const options = pick(filterValue.value, ['room', 'tags', 'type'])
    router.push({ query: omitBy(options, (value) => value === '*'), replace: true })
  }
})

</script>
