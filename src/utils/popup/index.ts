import { ScrollLockManager } from '@/utils/scrollLock'

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

export interface PopupManager {
  readonly isPopup: boolean;
  popupContainerType: PopupContainerType;
  popupContentData: PopupContentData;
}

class PopupManagerConcrete implements PopupManager {
  private _popupContentData: PopupContentData = { type: PopupContentType.Empty }
  private _scrollLockManager: ScrollLockManager
  public popupContainerType: PopupContainerType = PopupContainerType.Default

  constructor (scrollLockManager: ScrollLockManager) {
    this._scrollLockManager = scrollLockManager
  }

  public get isPopup (): boolean {
    return this._popupContentData.type !== PopupContentType.Empty
  }

  public get popupContentData (): PopupContentData {
    return Object.freeze(this._popupContentData)
  }

  public set popupContentData (newValue: PopupContentData) {
    this._popupContentData = newValue
    this.isPopup ? this._scrollLockManager.lock() : this._scrollLockManager.unlock()
  }
}

export function createPopupManager (scrollLockManager: ScrollLockManager): PopupManager {
  return new PopupManagerConcrete(scrollLockManager)
}
