// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export interface FullPageProgressService {
  readonly isLoading: boolean;
  setStatus: (status: boolean) => void;
}

interface MethodInject {
  lockScrolling: () => void;
  unlockScrolling: () => void;
}
class FullPageProgressServiceConcrete implements FullPageProgressService {
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

  public setStatus (status: boolean): void {
    status ? this._lockScrolling() : this._unlockScrolling()
    status ? this._stack.push(true) : ((this._stack.length > 0) && this._stack.pop())
  }
}

export function createFullPageProgressService (inject: MethodInject): FullPageProgressService {
  return new FullPageProgressServiceConcrete(inject)
}
