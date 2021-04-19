import { delay } from '@/utils/common'
import { computed, InjectionKey, ref, Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useScrollLock } from '../scroll-lock'
import { createModuleHook, createModuleSetup } from '../utils'

export { default as FullPageProgress } from './components/FullPageProgress.vue'

interface UseProgress {
  isLoading: Ref<boolean>;
  start: (needLock?: boolean) => void;
  done: (needUnlock?: boolean) => void;
}

const PROVIDE_KEY: InjectionKey<UseProgress> = Symbol('progress')
const fallback: UseProgress = {
  isLoading: ref(false),
  start: () => {},
  done: () => {}
}

const _useProgress = (): UseProgress => {
  const router = useRouter()
  const { lockScroll: lock, unlockScroll: unlock } = useScrollLock()
  const stack = ref<true[]>([])
  const isLoading = computed<boolean>(() => stack.value.length > 0)
  const start = (needLock = true) => {
    needLock && lock()
    stack.value.push(true)
  }
  const done = (needUnlock = true) => {
    stack.value.pop()
    needUnlock && unlock()
  }

  router.beforeEach((to, from) => {
    if (to.name === from.name) return
    start(false)
  })
  router.afterEach(async (to, from) => {
    if (to.name === from.name) return
    await delay(700)
    done(false)
  })

  return {
    isLoading,
    start,
    done
  }
}

export const setup = createModuleSetup(PROVIDE_KEY, _useProgress, fallback)
export const useProgress = createModuleHook(PROVIDE_KEY, _useProgress, fallback)
