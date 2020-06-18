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

export interface PopupData {
  containerType: PopupContainerType;
  contentData: PopupContentData;
}

export interface PopupManager {
  readonly isPopup: boolean;
  readonly popupContainerType: PopupContainerType;
  readonly popupContentData: PopupContentData;
  popup: (popupData: PopupData) => void;
  close: () => void;
}

class PopupManagerConcrete implements PopupManager {
  private _popupDataStack: PopupData[] = [{
    containerType: PopupContainerType.Default,
    contentData: {
      type: PopupContentType.Empty
    }
  }]

  private _scrollLockManager: ScrollLockManager

  constructor (scrollLockManager: ScrollLockManager) {
    this._scrollLockManager = scrollLockManager
  }

  public get isPopup (): boolean {
    return this._popupDataStack.length > 1
  }

  public get popupContentData (): PopupContentData {
    const popupData: PopupData = this._popupDataStack.slice(-1)[0]
    return Object.freeze(popupData.contentData)
  }

  public get popupContainerType (): PopupContainerType {
    const popupData: PopupData = this._popupDataStack.slice(-1)[0]
    return Object.freeze(popupData.containerType)
  }

  public popup (popupData: PopupData) {
    this._popupDataStack.push(popupData)
  }

  public close (): void {
    if (this._popupDataStack.length > 1) {
      this._popupDataStack.pop()
    }
  }
}

export function createPopupManager (scrollLockManager: ScrollLockManager): PopupManager {
  return new PopupManagerConcrete(scrollLockManager)
}
