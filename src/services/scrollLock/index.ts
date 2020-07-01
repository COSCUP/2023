// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export interface Position {
  x: number;
  y: number;
}

export interface ScrollLockService {
  readonly isLocked: boolean;
  readonly currentScrollPosition: Position;
  lock: () => void;
  unlock: () => void;
}

class ScrollLockServiceConcrete implements ScrollLockService {
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

  public lock (): void {
    this._lockStack.push({
      x: window.scrollX,
      y: window.scrollY
    })
  }

  public unlock (): void {
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
  }
}

export function createScrollLockService (): ScrollLockService {
  return new ScrollLockServiceConcrete()
}
