// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { ScrollLockManager } from '@/utils/scrollLock'

export interface FullPageProgressManager {
  readonly isLoading: boolean;
  setStatus: (status: boolean) => void;
}

class FullPageProgressManagerConcrete implements FullPageProgressManager {
  private _scrollLockManager: ScrollLockManager
  private _stack: true[] = []

  constructor (scrollLockManager: ScrollLockManager) {
    this._scrollLockManager = scrollLockManager
  }

  public get isLoading () {
    return this._stack.length > 0
  }

  public setStatus (status: boolean): void {
    status ? this._scrollLockManager.lock() : this._scrollLockManager.unlock()
    status ? this._stack.push(true) : ((this._stack.length > 0) && this._stack.pop())
  }
}

export function createFullPageProgressManager (scrollLockManager: ScrollLockManager): FullPageProgressManager {
  return new FullPageProgressManagerConcrete(scrollLockManager)
}
