import { ScrollLockManager } from '@/utils/scrollLock'
import { MetaOptions, MetaManager } from '../meta'

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
  metaOptions: MetaOptions;
  containerType: PopupContainerType;
  contentData: PopupContentData;
  onClose?: () => void;
}

export interface PopupManager {
  readonly isPopup: boolean;
  readonly popupData: PopupData;
  popup: (popupData: PopupData) => void;
  close: () => void;
}

interface Inject {
  scrollLockManager: ScrollLockManager;
  metaManager: MetaManager;
}

class PopupManagerConcrete implements PopupManager {
  private _popupDataStack: PopupData[] = [{
    metaOptions: {},
    containerType: PopupContainerType.Default,
    contentData: {
      type: PopupContentType.Empty
    }
  }]

  private _scrollLockManager: ScrollLockManager
  private _metaManager: MetaManager

  constructor (inject: Inject) {
    const { scrollLockManager, metaManager } = inject
    this._scrollLockManager = scrollLockManager
    this._metaManager = metaManager
  }

  public get isPopup (): boolean {
    return this._popupDataStack.length > 1
  }

  public get popupData (): PopupData {
    return Object.freeze(this._popupDataStack.slice(-1)[0])
  }

  public popup (popupData: PopupData) {
    this._popupDataStack.push(popupData)
    this._scrollLockManager.lock()
    this._metaManager.setMeta(this.popupData.metaOptions)
  }

  public close (): void {
    if (this._popupDataStack.length > 1) {
      (this.popupData.onClose ?? (() => { /**/ }))()
      this._popupDataStack.pop()
      this._scrollLockManager.unlock()
      this._metaManager.setMeta(this.popupData.metaOptions)
    }
  }
}

export function createPopupManager (inject: Inject): PopupManager {
  return new PopupManagerConcrete(inject)
}
