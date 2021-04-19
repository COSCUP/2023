// Copyright (c) 2021 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import announcement from '@/assets/json/announcement.json'
import markdown from '@/utils/markdown'
import { useStorage } from '@vueuse/core'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePopUp } from '../pop-up'
import { useSetupCtx } from '../utils'
import { Locale } from '../i18n'

export const setup = () => {
  const { isClient, router } = useSetupCtx()
  const { openPopUp, closePopUp, currentPopUp } = usePopUp()
  const { locale } = useI18n()
  const uuid = useStorage<string>('announcement-uuid', '')
  const isUnread = computed(() => uuid.value !== announcement.uuid)

  isClient && watch(isUnread, (bool) => {
    if (!bool) return
    uuid.value = announcement.uuid
    router.push({
      query: {
        popUp: 'announcement'
      }
    })
  }, {
    immediate: true
  })

  watch(() => router.currentRoute.value.query, async ({ popUp: queryPopUp }) => {
    if (queryPopUp !== 'announcement') {
      currentPopUp.value?.popupId === 'announcement' && closePopUp()
      return
    }
    openPopUp({
      popupId: 'announcement',
      metaOptions: {
        title: announcement.meta.title[locale.value as Locale],
        description: announcement.meta.description[locale.value as Locale]
      },
      containerData: {
        type: 'default'
      },
      contentData: {
        type: 'html',
        html: `<div class="markdown">${markdown(announcement.content[locale.value as Locale])}</div>`
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
