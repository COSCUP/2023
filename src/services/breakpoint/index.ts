// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { debounce } from 'lodash'
import { useService } from '@/utils/common'

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type BreakpointWith<T> = {
  [breakpoint in Breakpoint]: T
}

export interface BreakpointService {
  breakpoint: Breakpoint;
  readonly xsOnly: boolean;
  readonly smOnly: boolean;
  readonly smAndUp: boolean;
  readonly smAndDown: boolean;
  readonly mdOnly: boolean;
  readonly mdAndUp: boolean;
  readonly mdAndDown: boolean;
  readonly lgOnly: boolean;
  readonly lgAndUp: boolean;
  readonly lgAndDown: boolean;
  readonly xlOnly: boolean;
  startDetect: () => void;
  stopDetect: () => void;
}

class BreakpointServiceConcrete implements BreakpointService {
  public breakpoint: Breakpoint = 'xl'
  private _debouncedDetectBreakpoint = debounce(() => { this.breakpoint = this._detectBreakpoint() }, 300)

  private _detectBreakpoint (): Breakpoint {
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

  public startDetect () {
    this._debouncedDetectBreakpoint()
    window.addEventListener('resize', this._debouncedDetectBreakpoint)
  }

  public stopDetect () {
    window.removeEventListener('resize', this._debouncedDetectBreakpoint)
  }
}

export function createBreakpointService (): BreakpointService {
  return new BreakpointServiceConcrete()
}

export function useBreakpointService (): BreakpointService {
  return useService<BreakpointService>('breakpointService')
}
