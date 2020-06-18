export interface Position {
  x: number;
  y: number;
}

export interface ScrollLockManager {
  readonly isLocked: boolean;
  readonly currentScrollPosition: Position;
  lock: () => void;
  unlock: () => void;
}

class ScrollLockManagerConcrete implements ScrollLockManager {
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
    setTimeout(() => {
      const position: Position = this._lockStack.pop() ?? {
        x: 0,
        y: 0
      }
      window.scrollTo({
        left: position.x,
        top: position.y,
        behavior: 'auto'
      })
    })
  }
}

export function createScrollLockManager (): ScrollLockManager {
  return new ScrollLockManagerConcrete()
}
