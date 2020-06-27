// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import announcement from '@/assets/json/announcement.json'
import { LanguageService, LanguageType } from '@/services/language'
import { PopupService, PopupData, PopupContainerType, PopupContentType } from '@/services/popup'
import markdown from '@/utils/markdown'
import { useService } from '@/utils/common'

interface Inject {
  popupService: PopupService;
  languageService: LanguageService;
}

export interface AnnouncementService {
  readonly hasUpdated: boolean;
  showAnnouncement: (onClose?: () => void) => Promise<void>;
}

class AnnouncementServiceConcrete implements AnnouncementService {
  private _languageService: LanguageService
  private _popupService: PopupService

  constructor (inject: Inject) {
    this._languageService = inject.languageService
    this._popupService = inject.popupService
  }

  public get hasUpdated (): boolean {
    const currentUUID = localStorage.getItem('announcement') ?? ''
    return currentUUID !== announcement.uuid
  }

  public async showAnnouncement (onClose?: () => void) {
    const languageType: LanguageType = this._languageService.languageType
    const popupData: PopupData = {
      popupId: 'announcement',
      metaOptions: {
        title: announcement.meta.title[languageType],
        description: announcement.meta.description[languageType]
      },
      containerType: PopupContainerType.Default,
      contentData: {
        type: PopupContentType.General,
        html: `<div class="markdown">${await markdown(announcement.content[languageType])}</div>`
      },
      onClose
    }
    this._popupService.popup(popupData)
    localStorage.setItem('announcement', announcement.uuid)
  }
}

export function createAnnouncementService (inject: Inject) {
  return new AnnouncementServiceConcrete(inject)
}

export function useAnnouncementService (): AnnouncementService {
  return useService<AnnouncementService>('announcementService')
}
