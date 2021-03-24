// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { debounce } from 'lodash'
import { EventEmitter, Listener } from 'events'

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type BreakpointWith<T> = Record<Breakpoint, T>

export interface BreakpointService {
  breakpoint: Breakpoint;
  xsOnly: boolean;
  smOnly: boolean;
  smAndUp: boolean;
  smAndDown: boolean;
  mdOnly: boolean;
  mdAndUp: boolean;
  mdAndDown: boolean;
  lgOnly: boolean;
  lgAndUp: boolean;
  lgAndDown: boolean;
  xlOnly: boolean;
  startDetect: () => void;
  stopDetect: () => void;
  onUpdated: (listener: Listener) => void;
}

class BreakpointServiceConcrete implements BreakpointService {
  private _emitter = new EventEmitter()
  private _breakpoint: Breakpoint = 'xl'
  private _onBreakpointChanged = debounce(() => {
    const newBreakpoint = this._getBreakpoint()
    if (this.breakpoint === newBreakpoint) return
    this.breakpoint = this._getBreakpoint()
  })

  private _getBreakpoint (): Breakpoint {
    // $xs-max-width: 600px;
    // $sm-max-width: 960px;
    // $md-max-width: 1264px;
    // $lg-max-width: 1904px;
    const breakpoints: BreakpointWith<string> = {
      xs: '(max-width: 600px)',
      sm: '(min-width: 601px) and (max-width: 960px)',
      md: '(min-width: 961px) and (max-width: 1264px)',
      lg: '(min-width: 1265px) and (max-width: 1904px)',
      xl: '(min-width: 1905px)'
    }
    const result = Object.entries(breakpoints)
      .map((entry): [Breakpoint, boolean] => [entry[0] as Breakpoint, window.matchMedia(entry[1]).matches])
      .find((entry) => entry[1])

    return result ? result[0] : 'xl'
  }

  public get breakpoint () {
    return this._breakpoint
  }

  public set breakpoint (value) {
    this._breakpoint = value
    this._emitter.emit('update')
  }

  public get xsOnly () {
    return this.breakpoint === 'xs'
  }

  public get smOnly () {
    return this.breakpoint === 'sm'
  }

  public get smAndDown () {
    return ['xs', 'sm'].includes(this.breakpoint)
  }

  public get smAndUp () {
    return ['sm', 'md', 'lg', 'xl'].includes(this.breakpoint)
  }

  public get mdOnly () {
    return this.breakpoint === 'md'
  }

  public get mdAndDown () {
    return ['xs', 'sm', 'md'].includes(this.breakpoint)
  }

  public get mdAndUp () {
    return ['md', 'lg', 'xl'].includes(this.breakpoint)
  }

  public get lgOnly () {
    return this.breakpoint === 'lg'
  }

  public get lgAndDown () {
    return ['xs', 'sm', 'md', 'lg'].includes(this.breakpoint)
  }

  public get lgAndUp () {
    return ['lg', 'xl'].includes(this.breakpoint)
  }

  public get xlOnly () {
    return this.breakpoint === 'xl'
  }

  public onUpdated (listener: Listener) {
    this._emitter.on('update', listener)
  }

  public startDetect () {
    this._onBreakpointChanged()
    window.addEventListener('resize', this._onBreakpointChanged)
  }

  public stopDetect () {
    window.removeEventListener('resize', this._onBreakpointChanged)
  }
}

export function createBreakpointService (): BreakpointService {
  return new BreakpointServiceConcrete()
}
