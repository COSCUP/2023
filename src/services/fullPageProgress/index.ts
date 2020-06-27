// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { ScrollLockService } from '@/services/scrollLock'
import { useService } from '@/utils/common'

export interface FullPageProgressService {
  readonly isLoading: boolean;
  setStatus: (status: boolean) => void;
}

class FullPageProgressServiceConcrete implements FullPageProgressService {
  private _scrollLockService: ScrollLockService
  private _stack: true[] = []

  constructor (scrollLockService: ScrollLockService) {
    this._scrollLockService = scrollLockService
  }

  public get isLoading () {
    return this._stack.length > 0
  }

  public setStatus (status: boolean): void {
    status ? this._scrollLockService.lock() : this._scrollLockService.unlock()
    status ? this._stack.push(true) : ((this._stack.length > 0) && this._stack.pop())
  }
}

export function createFullPageProgressService (scrollLockService: ScrollLockService): FullPageProgressService {
  return new FullPageProgressServiceConcrete(scrollLockService)
}

export function useFullPageProgressService (): FullPageProgressService {
  return useService<FullPageProgressService>('fullPageProgressService')
}
