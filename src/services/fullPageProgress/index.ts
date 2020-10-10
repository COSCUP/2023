// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { EventEmitter, Listener } from 'events'

export interface FullPageProgressService {
  isLoading: boolean;
  setStatus: (status: boolean) => void;
  onUpdated: (listener: Listener) => void;
}

interface MethodInject {
  lockScrolling: () => void;
  unlockScrolling: () => void;
}
class FullPageProgressServiceConcrete implements FullPageProgressService {
  private _emitter = new EventEmitter()
  private _lockScrolling: () => void
  private _unlockScrolling: () => void
  private _stack: true[] = []

  constructor (inject: MethodInject) {
    this._lockScrolling = inject.lockScrolling
    this._unlockScrolling = inject.unlockScrolling
  }

  public get isLoading () {
    return this._stack.length > 0
  }

  public onUpdated (listener: Listener) {
    this._emitter.on('update', listener)
  }

  public setStatus (status: boolean): void {
    const currentStatus = this.isLoading
    status ? this._lockScrolling() : this._unlockScrolling()
    status ? this._stack.push(true) : ((this._stack.length > 0) && this._stack.pop())
    if (currentStatus !== status) {
      this._emitter.emit('update')
    }
  }
}

export function createFullPageProgressService (inject: MethodInject): FullPageProgressService {
  return new FullPageProgressServiceConcrete(inject)
}
