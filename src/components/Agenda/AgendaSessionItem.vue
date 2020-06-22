<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <router-link class="agenda-session-item" :to="location">
    <section class="content-section">
      <h4 class="track">
        <span v-show="breakpointManager.xsOnly" class="room">{{ room }}</span>
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
import Vue from 'vue'
import { Location } from 'vue-router'
import { Session, AgendaService, formatTimeString } from '@/utils/agenda'
import { injectedThis } from '@/utils/common'
import { LanguageService } from '@/utils/language'
import { BreakpointManager } from '@/utils/breakpoint'

function injected (thisArg: unknown) {
  return injectedThis<{
    languageService: LanguageService;
    agendaService: AgendaService;
    breakpointManager: BreakpointManager;
  }>(thisArg)
}

export default Vue.extend({
  name: 'AgendaSessionItem',
  inject: ['languageService', 'agendaService', 'breakpointManager'],
  props: {
    sessionId: {
      type: String,
      required: true
    }
  },
  computed: {
    laugaugeType (): 'en' | 'zh' {
      if (injected(this).languageService.languageType === 'en') return 'en'
      else return 'zh'
    },
    session (): Session {
      const session = injected(this).agendaService.getSessionById(this.sessionId)
      if (session === null) throw new Error('Invalid Session')
      return session
    },
    location (): Location {
      return {
        name: 'AgendaDetail',
        params: {
          ...this.$route.params,
          sessionId: this.sessionId
        }
      }
    },
    track (): string {
      return this.session.type[this.laugaugeType].name
    },
    period (): string {
      return `${formatTimeString(this.session.start, '：')} ~ ${formatTimeString(this.session.end, '：')}`
    },
    title (): string {
      return this.session[this.laugaugeType].title
    },
    speakers (): string[] {
      return this.session.speakers.map((speaker) => speaker[this.laugaugeType].name)
    },
    tags (): string[] {
      return this.session.tags.map((tag) => tag[this.laugaugeType].name)
    },
    language (): string {
      return this.session.language
    },
    room (): string {
      return this.session.room[this.laugaugeType].name.split(' / ')[0]
    }
  }
})
</script>
