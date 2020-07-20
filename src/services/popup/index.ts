// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { ScrollLockService } from '@/services/scrollLock'
import { MetaOptions, MetaService } from '@/services/meta'

export enum PopupContentType {
  Empty = 'Empty',
  General = 'General'
}

export enum PopupContainerType {
  Default = 'Default',
  Session = 'Session'
}

interface PopupContainerDataBase {
  type: PopupContainerType;
}

export interface DefaultPopupContainerData extends PopupContainerDataBase {
  type: PopupContainerType.Default;
}

export interface SessionPopupContainerData extends PopupContainerDataBase {
  type: PopupContainerType.Session;
}

export type PopupContainerData = DefaultPopupContainerData | SessionPopupContainerData

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
  containerData: PopupContainerData;
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
  scrollLockService: ScrollLockService;
  metaService: MetaService;
}

interface MethodInject {
  lockScrolling: () => void;
  unlockScrolling: () => void;
  setMeta: (options: MetaOptions) => void;
}

class PopupServiceConcrete implements PopupService {
  private _popupDataStack: PopupData[] = [{
    metaOptions: {},
    containerData: {
      type: PopupContainerType.Default
    },
    contentData: {
      type: PopupContentType.Empty
    }
  }]

  private _lockScrolling: () => void
  private _unlockScrolling: () => void
  private _setMeta: (options: MetaOptions) => void

  constructor (inject: MethodInject) {
    this._lockScrolling = inject.lockScrolling
    this._unlockScrolling = inject.unlockScrolling
    this._setMeta = inject.setMeta
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
    this._lockScrolling()
    this._setMeta(this.popupData.metaOptions)
  }

  public close (): void {
    if (this._popupDataStack.length > 1) {
      (this.popupData.onClose || (() => { /**/ }))()
      this._popupDataStack.pop()
      this._unlockScrolling()
      this._setMeta(this.popupData.metaOptions)
    }
  }
}

export function createPopupService (inject: MethodInject): PopupService {
  return new PopupServiceConcrete(inject)
}
