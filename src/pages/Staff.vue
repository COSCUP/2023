<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main id="staff" class="page-container">
    <div
      v-for="group in staffData"
      :key="`staff-group-${group.tid}`"
      class="group-box-wrapper"
    >
      <section class="group-box">
        <h2 class="group-name">
          {{ languageService.languagePack.staff.groups[group.tid] }}
        </h2>
        <div class="staff-wrapper">
          <div
            v-for="staff in group.staffs"
            :key="`${group.tid}-${staff.name}`"
            class="staff"
            :class="{
              chief: staff.isChief
            }"
          >
            <div class="staff-avatar-wrapper">
              <div class="staff-avatar-container">
                <img
                  class="staff-avatar"
                  :src="
                    `https://www.gravatar.com/avatar/${staff.email_hash}?s=320&d=identicon&r=g`
                  "
                  :alt="`${staff.name}'s Avatar`"
                />
              </div>
            </div>
            <p>{{ staff.name }}</p>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import { defineComponent, computed, onMounted, inject, ref } from '@vue/composition-api'
import _staffData from '@/../public/json/staff.json'
import { LanguageService } from '@/services/language'

import '@/assets/scss/pages/staff.scss'

export default defineComponent({
  name: 'Staff',
  setup () {
    const languageService = inject<LanguageService>('languageService')

    const staffData = computed(() => {
      const groupSequence = ['coordinator', 'secretary', 'program', 'field', 'finance', 'it', 'marketing', 'photo', 'sponsor', 'streaming']
      return _staffData
        .sort((a, b) => groupSequence.indexOf(a.tid) - groupSequence.indexOf(b.tid))
        .map((group) => {
          return {
            tid: group.tid,
            name: group.name,
            staffs: [
              ...group.chiefs.map((chief) => ({ ...chief, isChief: true })),
              ...group.members.map((chief) => ({ ...chief, isChief: false }))
            ]
          }
        })
    })

    onMounted(() => {
      Vue.prototype.$dispatchRenderedEvent()
    })

    return {
      languageService,
      staffData
    }
  }
})
</script>
