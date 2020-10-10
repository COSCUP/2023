// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { MetaOptions } from '@/services/meta'
import { EventEmitter, Listener } from 'events'

export type PopupContentType = 'empty' | 'general'

export type PopupContainerType = 'default' | 'session'

interface PopupContainerDataBase {
  type: PopupContainerType;
}

export interface DefaultPopupContainerData extends PopupContainerDataBase {
  type: 'default';
}

export interface SessionPopupContainerData extends PopupContainerDataBase {
  type: 'session';
}

export type PopupContainerData = DefaultPopupContainerData | SessionPopupContainerData

interface PopupContentDataBase {
  type: PopupContentType;
}

export interface EmptyPopupContentData extends PopupContentDataBase {
  type: 'empty';
}

export interface GeneralPopupContentData extends PopupContentDataBase {
  type: 'general';
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
  onUpdated: (listener: Listener) => void;
}

interface MethodInject {
  lockScrolling: () => void;
  unlockScrolling: () => void;
  setMeta: (options: MetaOptions) => void;
}

class PopupServiceConcrete implements PopupService {
  private _emitter = new EventEmitter()
  private _popupDataStack: PopupData[] = [{
    metaOptions: {},
    containerData: {
      type: 'default'
    },
    contentData: {
      type: 'empty'
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
    return this._popupDataStack.slice(-1)[0]
  }

  public onUpdated (listener: Listener) {
    this._emitter.on('update', listener)
  }

  public popup (popupData: PopupData) {
    if (popupData.popupId && this._popupDataStack.some((data) => data.popupId === popupData.popupId)) return
    this._popupDataStack.push(popupData)
    this._lockScrolling()
    this._setMeta(this.popupData.metaOptions)
    this._emitter.emit('update')
  }

  public close (): void {
    if (this._popupDataStack.length > 1) {
      (this.popupData.onClose || (() => { /**/ }))()
      this._popupDataStack.pop()
      this._unlockScrolling()
      this._setMeta(this.popupData.metaOptions)
      this._emitter.emit('update')
    }
  }
}

export function createPopupService (inject: MethodInject): PopupService {
  return new PopupServiceConcrete(inject)
}
