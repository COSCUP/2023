// Copyright (c) 2021 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import _announcements from '@/assets/json/announcement.json'
import markdown from '@/utils/markdown'
import { useStorage } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePopUp } from '../pop-up'
import { useSetupCtx } from '../utils'
import { Locale } from '../i18n'

interface Announcement {
  uuid: string;
  meta: {
    title: Record<Locale, string>;
    description: Record<Locale, string>;
  };
  content: Record<Locale, string>;
}

export const setup = () => {
  const { isClient, router } = useSetupCtx()
  const { openPopUp, closePopUp, currentPopUp } = usePopUp()
  const { locale } = useI18n()
  const uuid = useStorage<string>('announcement-uuid', '')
  const announcements = ref<Announcement[]>(_announcements)
  const announcement = computed<Announcement | null>(() => announcements.value.length > 0 ? announcements.value.slice(-1)[0] : null)
  const isUnread = computed(() => announcements.value.length > 0 && uuid.value !== announcements.value.slice(-1)[0].uuid)

  isClient && watch(isUnread, (bool) => {
    if (announcement.value === null || !bool) return
    uuid.value = announcement.value.uuid
    router.push({
      query: {
        popUp: 'announcement'
      }
    })
  }, {
    immediate: true
  })

  watch(() => router.currentRoute.value.query, async ({ popUp: queryPopUp }) => {
    if (announcement.value === null) return
    if (queryPopUp !== 'announcement') {
      currentPopUp.value?.popupId === 'announcement' && closePopUp()
      return
    }
    openPopUp({
      popupId: 'announcement',
      order: 9999,
      metaOptions: {
        title: announcement.value.meta.title[locale.value as Locale],
        description: announcement.value.meta.description[locale.value as Locale]
      },
      containerData: {
        type: 'default'
      },
      contentData: {
        type: 'html',
        html: `<div class="markdown">${markdown(announcement.value.content[locale.value as Locale])}</div>`
      },
      onClose: () => {
        router.push({
          query: {
            popUp: undefined
          }
        })
      }
    })
  }, {
    immediate: true
  })
}
