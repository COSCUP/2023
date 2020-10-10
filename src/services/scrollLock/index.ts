// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { EventEmitter, Listener } from 'events'

export interface Position {
  x: number;
  y: number;
}

export interface ScrollLockService {
  isLocked: boolean;
  currentScrollPosition: Position;
  lock: () => void;
  unlock: () => void;
  onUpdated: (listener: Listener) => void;
}

class ScrollLockServiceConcrete implements ScrollLockService {
  private _emitter = new EventEmitter()
  private _lockStack: Position[] = []

  public get isLocked (): boolean {
    return this._lockStack.length > 0
  }

  public get currentScrollPosition (): Position {
    return this._lockStack.slice(-1)[0] ?? {
      x: 0,
      y: 0
    }
  }

  public onUpdated (listener: Listener) {
    this._emitter.on('update', listener)
  }

  public lock (): void {
    const currentStatus = this.isLocked
    this._lockStack.push({
      x: window.scrollX,
      y: window.scrollY
    })
    if (currentStatus !== this.isLocked) {
      this._emitter.emit('update')
    }
  }

  public unlock (): void {
    const currentStatus = this.isLocked
    const position: Position = this._lockStack.pop() ?? {
      x: 0,
      y: 0
    }
    setTimeout(() => {
      window.scrollTo({
        left: position.x,
        top: position.y,
        behavior: 'auto'
      })
    })
    if (currentStatus !== this.isLocked) {
      this._emitter.emit('update')
    }
  }
}

export function createScrollLockService (): ScrollLockService {
  return new ScrollLockServiceConcrete()
}
