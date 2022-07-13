import { computed, InjectionKey, Ref, ref } from 'vue'
import { useBreakpoints as vueuseBreakpoints } from '@vueuse/core'
import { createModuleHook } from '../utils'

export type BreakpointSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type Breakpoint = 'xsOnly' | 'smOnly' | 'smAndUp' | 'smAndDown' | 'mdOnly' | 'mdAndUp' | 'mdAndDown' | 'lgOnly' | 'lgAndUp' | 'lgAndDown' | 'xlOnly'

type UseBreakpoints = Record<Breakpoint, Ref<boolean>> & {
  breakpoint: Ref<BreakpointSize>;
}

const PROVIDE_KEY: InjectionKey<UseBreakpoints> = Symbol('breakpoints')
const fallback: UseBreakpoints = {
  breakpoint: ref('xl'),
  xlOnly: ref(true),
  lgAndUp: ref(true),
  lgOnly: ref(false),
  lgAndDown: ref(false),
  mdAndUp: ref(true),
  mdOnly: ref(false),
  mdAndDown: ref(false),
  smAndUp: ref(true),
  smOnly: ref(false),
  smAndDown: ref(false),
  xsOnly: ref(false)
}

const _useBreakpoints = (): UseBreakpoints => {
  const breakpoints = vueuseBreakpoints<Exclude<BreakpointSize, 'xs'>>({
    sm: 600,
    md: 960,
    lg: 1264,
    xl: 1904
  })
  const breakpoint = computed(() => {
    const results: [BreakpointSize, boolean][] = [
      ['xl', breakpoints.greater('xl').value],
      ['lg', breakpoints.between('lg', 'xl').value],
      ['md', breakpoints.between('md', 'lg').value],
      ['sm', breakpoints.between('sm', 'md').value],
      ['xs', breakpoints.smaller('sm').value]
    ]
    return results.find((result) => result[1])?.[0] || 'xl'
  })
  const xlOnly = breakpoints.greater('xl')
  const lgAndUp = breakpoints.greater('lg')
  const lgOnly = breakpoints.between('lg', 'xl')
  const lgAndDown = breakpoints.smaller('xl')
  const mdAndUp = breakpoints.greater('md')
  const mdOnly = breakpoints.between('md', 'lg')
  const mdAndDown = breakpoints.smaller('lg')
  const smAndUp = breakpoints.greater('sm')
  const smOnly = breakpoints.between('sm', 'lg')
  const smAndDown = breakpoints.smaller('md')
  const xsOnly = breakpoints.smaller('sm')

  return {
    breakpoint,
    xlOnly,
    lgAndUp,
    lgOnly,
    lgAndDown,
    mdAndUp,
    mdOnly,
    mdAndDown,
    smAndUp,
    smOnly,
    smAndDown,
    xsOnly
  }
}

// export const setup = createModuleSetup(PROVIDE_KEY, _useBreakpoints, fallback)
export const useBreakpoints = createModuleHook(PROVIDE_KEY, _useBreakpoints, fallback)
