// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { ScrollLockManager } from '@/utils/scrollLock'

export interface FullPageProgressService {
  readonly isLoading: boolean;
  setStatus: (status: boolean) => void;
}

class FullPageProgressServiceConcrete implements FullPageProgressService {
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

export function createFullPageProgressService (scrollLockManager: ScrollLockManager): FullPageProgressService {
  return new FullPageProgressServiceConcrete(scrollLockManager)
}
