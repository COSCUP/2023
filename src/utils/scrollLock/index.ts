export interface Position {
  x: number;
  y: number;
}

export interface ScrollLockManager {
  isLocked: boolean;
  readonly currentScrollPosition: Position;
}

class ScrollLockManagerConcrete implements ScrollLockManager {
  private _isLocked = false
  private _currentScrollPosition: Position = {
    x: 0,
    y: 0
  }

  public get isLocked (): boolean {
    return this._isLocked
  }

  public set isLocked (newValue: boolean) {
    if (newValue) {
      this._currentScrollPosition = {
        x: window.scrollX,
        y: window.scrollY
      }
    }
    if (!newValue) {
      setTimeout(() => {
        window.scrollTo({
          left: this._currentScrollPosition.x,
          top: this._currentScrollPosition.y,
          behavior: 'auto'
        })

        this._currentScrollPosition = {
          x: 0,
          y: 0
        }
      })
    }
    this._isLocked = newValue
  }

  public get currentScrollPosition (): Position {
    return this._currentScrollPosition
  }
}

export function createScrollLockManager (): ScrollLockManager {
  return new ScrollLockManagerConcrete()
}
