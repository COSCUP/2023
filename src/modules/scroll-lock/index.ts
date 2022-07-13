import { computed, ref, nextTick, Ref, InjectionKey } from 'vue'
import { createModuleHook } from '../utils'

type Position = Record<'x' | 'y', number>

interface UseScrollLock {
  isScrollLocked: Ref<boolean>;
  scrollLockedPosition: Ref<Position | null>;
  lockScroll: () => void;
  unlockScroll: () => void;
}

const PROVIDE_KEY: InjectionKey<UseScrollLock> = Symbol('scroll-lock')
const fallback: UseScrollLock = {
  isScrollLocked: ref(false),
  scrollLockedPosition: ref(null),
  lockScroll: () => {},
  unlockScroll: () => {}
}

const _useScrollLock = (): UseScrollLock => {
  const stack = ref<Position[]>([])
  const isScrollLocked = computed<boolean>(() => stack.value.length > 0)
  const scrollLockedPosition = computed<Position | null>(() => stack.value[0] ?? null)
  const lockScroll = () => {
    const { scrollX: x, scrollY: y } = window
    stack.value.push({ x, y })
  }
  const unlockScroll = () => {
    const pos = stack.value.pop() ?? null
    pos && nextTick(() => {
      window.scrollTo(pos.x, pos.y)
    })
  }

  return {
    isScrollLocked,
    scrollLockedPosition,
    lockScroll,
    unlockScroll
  }
}

// export const setup = createModuleSetup(PROVIDE_KEY, _useScrollLock, fallback)
export const useScrollLock = createModuleHook(PROVIDE_KEY, _useScrollLock, fallback)
