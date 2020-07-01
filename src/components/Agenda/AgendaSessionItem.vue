<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <router-link class="agenda-session-item" :to="location">
    <section class="content-section">
      <h4 class="track">
        <span v-show="breakpointService.xsOnly" class="room">{{ room }}</span>
        <span>{{ track }}</span>
      </h4>
      <!--  -->
      <h4 class="period">{{ period }}</h4>
      <!--  -->
      <h2 class="title">{{ title }}</h2>
      <!--  -->
      <h3 class="speaker-list">
        <span>by</span>
        <span
          v-for="(name, i) in speakers"
          :key="`session-${session.id}-speaker-${i}`"
          class="speaker"
        >
          {{ name }}
        </span>
      </h3>
      <!--  -->
      <div class="tag-list">
        <span>
          {{ language }}
        </span>
        <span
          v-for="(name, i) in tags"
          :key="`tag-${session.id}-tag-${i}`"
          class="tag"
        >
          {{ name }}
        </span>
      </div>
    </section>
  </router-link>
</template>

<script lang="ts">
import { defineComponent, inject, computed, ComputedRef } from '@vue/composition-api'
import { useBreakpointService, useAgendaService } from '@/services/hooks'
import { formatTimeString } from '@/services/agenda'
import { useRouter } from '@/router'

export default defineComponent({
  name: 'AgendaSessionItem',
  props: {
    sessionId: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const router = useRouter()
    const agendaService = useAgendaService()
    const breakpointService = useBreakpointService()
    const languageType = inject<ComputedRef<'zh' | 'en'>>('languageType') || { value: 'zh' }
    const session = computed(() => {
      const session = agendaService.getSessionById(props.sessionId)
      if (session === null) throw new Error('Invalid Session')
      return session
    })
    const location = computed(() => {
      return {
        name: 'AgendaDetail',
        params: {
          ...router.currentRoute.params,
          sessionId: props.sessionId
        }
      }
    })
    const track = computed(() => session.value.type[languageType.value].name)
    const period = computed(() => `${formatTimeString(session.value.start, '：')} ~ ${formatTimeString(session.value.end, '：')}`)
    const title = computed(() => session.value[languageType.value].title)
    const speakers = computed(() => session.value.speakers.map((speaker) => speaker[languageType.value].name))
    const tags = computed(() => session.value.tags.map((tag) => tag[languageType.value].name))
    const language = computed(() => session.value.language)
    const room = computed(() => session.value.room[languageType.value].name.split(' / ')[0])

    return {
      breakpointService,
      session,
      location,
      track,
      period,
      title,
      speakers,
      tags,
      language,
      room
    }
  }
})
</script>
