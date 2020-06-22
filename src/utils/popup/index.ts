// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { ScrollLockManager } from '@/utils/scrollLock'
import { MetaOptions, MetaService } from '../meta'

export enum PopupContentType {
  Empty = 'Empty',
  General = 'General'
}

export enum PopupContainerType {
  Default = 'Default'
}

interface PopupContentDataBase {
  type: PopupContentType;
}

export interface EmptyPopupContentData extends PopupContentDataBase {
  type: PopupContentType.Empty;
}

export interface GeneralPopupContentData extends PopupContentDataBase {
  type: PopupContentType.General;
  html: string;
}

export type PopupContentData = EmptyPopupContentData | GeneralPopupContentData

export interface PopupData {
  popupId?: string;
  metaOptions: MetaOptions;
  containerType: PopupContainerType;
  contentData: PopupContentData;
  onClose?: () => void;
}

export interface PopupService {
  readonly isPopup: boolean;
  readonly popupData: PopupData;
  popup: (popupData: PopupData) => void;
  close: () => void;
}

interface Inject {
  scrollLockManager: ScrollLockManager;
  metaService: MetaService;
}

class PopupServiceConcrete implements PopupService {
  private _popupDataStack: PopupData[] = [{
    metaOptions: {},
    containerType: PopupContainerType.Default,
    contentData: {
      type: PopupContentType.Empty
    }
  }]

  private _scrollLockManager: ScrollLockManager
  private _metaService: MetaService

  constructor (inject: Inject) {
    const { scrollLockManager, metaService } = inject
    this._scrollLockManager = scrollLockManager
    this._metaService = metaService
  }

  public get isPopup (): boolean {
    return this._popupDataStack.length > 1
  }

  public get popupData (): PopupData {
    return Object.freeze(this._popupDataStack.slice(-1)[0])
  }

  public popup (popupData: PopupData) {
    if (popupData.popupId && this._popupDataStack.some((data) => data.popupId === popupData.popupId)) return
    this._popupDataStack.push(popupData)
    this._scrollLockManager.lock()
    this._metaService.setMeta(this.popupData.metaOptions)
  }

  public close (): void {
    if (this._popupDataStack.length > 1) {
      (this.popupData.onClose || (() => { /**/ }))()
      this._popupDataStack.pop()
      this._scrollLockManager.unlock()
      this._metaService.setMeta(this.popupData.metaOptions)
    }
  }
}

export function createPopupService (inject: Inject): PopupService {
  return new PopupServiceConcrete(inject)
}
