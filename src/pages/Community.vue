<!--
  Copyright (c) 2023 yoyo930021

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main id="community" class="page-container">
    <div v-if="communityList" class="outer-container">
      <div v-for="community in communityList" :key="community.id" class="card community-container">
        <a class="author" :name="community.id" />
        <div class="img-container">
          <a :href="community.link || undefined" target="_blank" rel="noopener">
            <img :src="community.image" :alt="`Community ${community.name[languageType]}'s logo`" />
          </a>
        </div>
        <div class="content-container">
          <a :href="community.link || undefined" target="_blank" rel="noopener">
            <h2>
              {{ community.name[languageType] }}
            </h2>
          </a>
          <article v-html="community.intro[languageType]" class="markdown"></article>
          <div class="readmore" @click="onReadmoreClick">
            <span>Read More</span>
          </div>
        </div>
        <div class="tag-container">
          <span title="Topic" v-if="community.topicIntro.en !== '' || community.topicIntro['zh-TW'] !== ''">
            <component :is="localActivityRounded"></component>
          </span>
          <span title="Booth" v-if="community.boothIntro.en !== '' || community.boothIntro['zh-TW'] !== ''">
            <component alt="Booth" :is="tableRestaurantRounded"></component>
          </span>
          <span title="Track" v-if="community.track !== ''">
            <component :is="coPresent"></component>
          </span>
        </div>
        <div class="collapse-content-container">
          <div class="collapse-button">
            <button @click="showContent(community.name[languageType], 'topic')"
              v-if="community.topicIntro.en !== '' || community.topicIntro['zh-TW'] !== ''">{{ t('community.tags.topics') }}</button>
            <button @click="showContent(community.name[languageType], 'booth')"
              v-if="community.boothIntro.en !== '' || community.boothIntro['zh-TW'] !== ''">{{ t('community.tags.booths') }}</button>
            <button @click="showContent(community.name[languageType], 'speaker')"
              v-if="community.track !== ''">{{ t('community.tags.track') }}</button>
          </div>
          <article class="topics" v-show="community.show === 'topic'">
            <a class="author" :name="community.id" />
            <div class="img-container">
              <a :href="community.topicLink || undefined" target="_blank" rel="noopener">
                <img :src="community.topicImage" :alt="`Community ${community.name[languageType]}'s logo`" />
              </a>
            </div>
            <div class="content-container">
              <a :href="community.topicLink || undefined" target="_blank" rel="noopener">
                <h2>
                  {{ community.name[languageType] }}
                </h2>
              </a>
              <article v-html="community.topicIntro[languageType]" class="markdown"></article>
              <div class="readmore" @click="onReadmoreClick">
                <span>Read More</span>
              </div>
            </div>
          </article>
          <article class="booth" v-show="community.show === 'booth'">
            <a class="author" :name="community.id" />
            <div class="img-container">
              <a :href="community.boothLink || undefined" target="_blank" rel="noopener">
                <img :src="community.boothImage" :alt="`Community ${community.name[languageType]}'s logo`" />
              </a>
            </div>
            <div class="content-container">
              <a :href="community.boothLink || undefined" target="_blank" rel="noopener">
                <h2>
                  {{ community.name[languageType] }}
                </h2>
              </a>
              <article v-html="community.boothIntro[languageType]" class="markdown"></article>
              <div class="readmore" @click="onReadmoreClick">
                <span>Read More</span>
              </div>
            </div>
          </article>
          <article class="speaker" v-show="community.show === 'speaker'">
            <div v-for="speaker in community.speaker" :key="speaker.id" class="card speaker-container">
              <a class="author" :name="speaker.id" />
              <div class="img-container">
                <a :href="undefined" target="_blank" rel="noopener">
                  <img :src="speaker.avatar" :alt="`topics ${speaker.name[languageType]}'s logo`" />
                </a>
              </div>
              <div class="content-container">
                <router-link v-if="speaker.sessionId" :to="{
                  name: 'SessionDetail',
                  params: {
                    sessionId: speaker.sessionId
                  },
                  query: {
                    from: 'Community'
                  }
                }">
                  <h2>
                    {{ speaker.name[languageType] }}
                  </h2>
                </router-link>
                <a v-else target="_blank" rel="noopener">
                  <h2>
                    {{ speaker.name[languageType] }}
                  </h2>
                </a>
                <article v-html="speaker.bio[languageType]" class="markdown"></article>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div class="card community-container">
        <div class="content-container partner-container">
          <h2>
            {{ t('community.partner.title') }}
          </h2>
          <article>
            <div v-for="partner in partnerList" :key="partner.name">
              <div class="avatar">
                <img :src="partner.image" :alt="partner.name">
              </div>
              <p>{{ partner.name }}</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, watch, reactive } from 'vue'
import markdown from '@/utils/markdown'
import communityData from '@/assets/json/community.json'
import sessionData from '@/assets/json/session.json'
import '@/assets/scss/pages/community.scss'
import { useBreakpoints } from '@/modules/breakpoints'
import { Locale } from '@/modules/i18n'
import { useI18n } from 'vue-i18n'
import { isClient } from '@vueuse/core'
import coPresent from '~icons/material-symbols/co-present'
import localActivityRounded from '~icons/material-symbols/local-activity-rounded'
import tableRestaurantRounded from '~icons/material-symbols/table-restaurant-rounded'

export default defineComponent({
  name: 'Sponsor',
  setup () {
    const { locale, t } = useI18n()
    const { breakpoint } = useBreakpoints()

    const languageType = computed(() => locale.value as Locale)

    const sessionList = computed(() => sessionData.sessions.map((el) => ({
      ...el,
      communityName: {
        en: '',
        'zh-TW': ''
      }
    })))

    sessionList.value.forEach(session => {
      const sessionType = sessionData.session_types.find(type => type.id === session.type)
      if (sessionType) {
        session.communityName.en = sessionType.en.name
        session.communityName['zh-TW'] = sessionType.zh.name
      }
    })

    const speakerList = computed(() => sessionData.speakers.map((el) => ({
      ...el,
      bio: {
        en: markdown(el.en.bio),
        'zh-TW': markdown(el.zh.bio)
      },
      name: {
        en: el.en.name,
        'zh-TW': el.zh.name
      },
      sessionId: sessionData.sessions.find(sp => sp.speakers.includes(el.id))?.id,
      prime: sessionData.sessions.find(sp => sp.speakers.includes(el.id))?.tags.includes('Prime'),
      track: sessionList.value.find(sp => sp.speakers.includes(el.id))?.communityName || { en: '', 'zh-TW': '' }
    })))

    const communityList = reactive(
      communityData.communities
        .map((el) => ({
          ...el,
          intro: {
            en: markdown(el.intro.en),
            'zh-TW': markdown(el.intro['zh-TW'])
          },
          boothIntro: {
            en: markdown(el.boothIntro.en !== undefined ? el.boothIntro.en : ''),
            'zh-TW': markdown(el.boothIntro['zh-TW'] !== undefined ? el.boothIntro['zh-TW'] : '')
          },
          topicIntro: {
            en: markdown(el.topicIntro.en !== undefined ? el.topicIntro.en : ''),
            'zh-TW': markdown(el.topicIntro['zh-TW'] !== undefined ? el.topicIntro['zh-TW'] : '')
          },
          speaker: speakerList.value.filter(sp => ((sp.track.en !== '' && sp.track['zh-TW'] !== '') && (el.track.includes(sp.track.en) || el.track.includes(sp.track['zh-TW'])))),
          show: ''
        }))
        .sort(() => Math.random() - 0.5)
    )

    const partnerList = computed(() => communityData.partners.map((el) => ({
      ...el,
      image: `https://www.gravatar.com/avatar/${el.email_hash}?s=320&d=identicon&r=g&d=https://volunteer.coscup.org/img/nonavatar.png`
    })))

    const detectOverflowContentElements = () => {
      const elements = Array.from(document.querySelectorAll('#sponsor .content-container'))
      elements.forEach((element) => {
        element.classList.remove('folded')
      })
      elements.forEach((element) => {
        if (element.getBoundingClientRect().height > 300) {
          element.classList.add('folded')
        }
      })
    }

    const onReadmoreClick = (event: MouseEvent) => {
      if (!isClient) return
      const contentContainer = (event.target as HTMLElement).parentElement as HTMLElement
      contentContainer.classList.remove('folded')
    }

    onMounted(async () => {
      isClient && detectOverflowContentElements()
    })

    isClient && watch(() => breakpoint.value, async () => {
      detectOverflowContentElements()
    })

    const showContent = (show: string, choose: string) => {
      const chooseCommunity = communityList.find(value => value.name[languageType.value] === show)
      if (chooseCommunity !== undefined && chooseCommunity.show === choose) {
        chooseCommunity.show = ''
      } else if (chooseCommunity !== undefined) {
        chooseCommunity.show = choose
      }
    }

    return {
      t,
      languageType,
      partnerList,
      communityList,
      speakerList,
      onReadmoreClick,
      showContent,
      coPresent,
      tableRestaurantRounded,
      localActivityRounded
    }
  }
})
</script>
