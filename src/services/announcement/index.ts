// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import announcement from '@/assets/json/announcement.json'
import { LanguageType } from '@/services/language'
import { PopupData } from '@/services/popup'
import markdown from '@/utils/markdown'

interface MethodInject {
  popup: (data: PopupData) => void;
  getLanguageType: () => LanguageType;
}

export interface AnnouncementService {
  readonly hasUpdated: boolean;
  showAnnouncement: (onClose?: () => void) => Promise<void>;
}

class AnnouncementServiceConcrete implements AnnouncementService {
  private _getLanguageType: () => LanguageType
  private _popup: (data: PopupData) => void

  constructor (inject: MethodInject) {
    this._getLanguageType = inject.getLanguageType
    this._popup = inject.popup
  }

  public get hasUpdated (): boolean {
    const currentUUID = localStorage.getItem('announcement') ?? ''
    return currentUUID !== announcement.uuid
  }

  public async showAnnouncement (onClose?: () => void) {
    const languageType: LanguageType = this._getLanguageType()
    const popupData: PopupData = {
      popupId: 'announcement',
      metaOptions: {
        title: announcement.meta.title[languageType],
        description: announcement.meta.description[languageType]
      },
      containerData: {
        type: 'default'
      },
      contentData: {
        type: 'general',
        html: `<div class="markdown">${await markdown(announcement.content[languageType])}</div>`
      },
      onClose
    }
    this._popup(popupData)
    localStorage.setItem('announcement', announcement.uuid)
  }
}

export function createAnnouncementService (inject: MethodInject) {
  return new AnnouncementServiceConcrete(inject)
}
