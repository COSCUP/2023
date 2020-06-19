<template>
  <main id="staff" class="page-container">
    <div
      v-for="group in staffs"
      :key="`staff-group-${group.tid}`"
      class="group-box-wrapper"
    >
      <section class="group-box">
        <h2 class="group-name">
          {{ languageManager.languagePack.staff.groups[group.tid] }}
        </h2>
        <div class="staff-wrapper">
          <div
            v-for="chief in group.chiefs"
            :key="`${group.tid}-${chief.name}`"
            class="staff chief"
          >
            <img
              class="staff-avatar"
              :src="
                `https://www.gravatar.com/avatar/${chief.email_hash}?s=320&d=identicon&r=g`
              "
              :alt="`${chief.name}'s Avatar`"
            />
            <p>{{ chief.name }}</p>
          </div>
          <div
            v-for="member in group.members"
            :key="`${group.tid}-${member.name}`"
            class="staff"
          >
            <img
              class="staff-avatar"
              :src="
                `https://www.gravatar.com/avatar/${member.email_hash}?s=320&d=identicon&r=g`
              "
              :alt="`${member.name}'s Avatar`"
            />
            <p>{{ member.name }}</p>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import _staffs from '@/../public/json/staff.json'
import '@/assets/scss/pages/staff.scss'

export default Vue.extend({
  name: 'Staff',
  inject: ['languageManager'],
  computed: {
    staffs () {
      const groupSequence = ['coordinator', 'secretary', 'program', 'field', 'finance', 'it', 'marketing', 'photo', 'sponsor', 'streaming']
      return _staffs.sort((a, b) => groupSequence.indexOf(a.tid) - groupSequence.indexOf(b.tid))
    }
  },
  mounted () {
    this.$emit('render')
  }
})
</script>
