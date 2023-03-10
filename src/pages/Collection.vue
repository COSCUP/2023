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
import { defineComponent, computed } from 'vue'
import { useSession } from '@/modules/session'
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
    const { sessionsMap } = useSession()

    const query = route.query.sessions?.toString().split('-')
    const sessions = computed(() => {
      if (query) {
        return query
      } else {
        const result = []
        for (const sessionId in sessionsMap.value) {
          if (sessionsMap.value?.[sessionId].isMark) result.push(sessionId)
        }
        return result
      }
    })

    return { sessions }
  }
})

</script>
