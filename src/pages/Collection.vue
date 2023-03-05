<template>
  <main id="collection" class="page-container">
    <h1 class="caption">
      <span>我的收藏</span>
    </h1>
    <article v-for="id in sessions" :sessionId="id" :key="id" class="session-list">
      <ScheduleItem :sessionId="id"></ScheduleItem>
    </article>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import ScheduleItem from '@/components/Session/ScheduleItem.vue'
import '@/assets/scss/pages/collection.scss'

export default defineComponent({
  name: 'SessionMark',
  components: {
    ScheduleItem
  },
  setup () {
    const route = useRoute()
    const sessions = route.query.sessions?.toString().split('-') ?? JSON.parse(window.localStorage.getItem('MARK_SESSIONS') ?? '[]')

    return { sessions }
  }
})

</script>
