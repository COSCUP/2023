// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import announcement from '@/assets/json/announcement.json'
import { PopupManager, PopupData, PopupContainerType, PopupContentType } from '../popup'
import markdown from '@/utils/markdown'
import { LanguageService, LanguageType } from '../language'

interface Inject {
  popupManager: PopupManager;
  languageService: LanguageService;
}

export interface AnnouncementManager {
  readonly hasUpdated: boolean;
  showAnnouncement: (onClose?: () => void) => Promise<void>;
}

class AnnouncementManagerConcrete implements AnnouncementManager {
  private _languageService: LanguageService
  private _popupManager: PopupManager

  constructor (inject: Inject) {
    this._languageService = inject.languageService
    this._popupManager = inject.popupManager
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
    this._popupManager.popup(popupData)
    localStorage.setItem('announcement', announcement.uuid)
  }
}

export function createAnnouncementManager (inject: Inject) {
  return new AnnouncementManagerConcrete(inject)
}
