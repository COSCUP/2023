import { useBreakpoints } from '../breakpoints'
import { UserModuleSetup } from '../types'

export const setup: UserModuleSetup = ({ router }) => {
  const { xsOnly } = useBreakpoints()
  router.afterEach((to, from) => {
    if (xsOnly.value) {
      to.meta.transitionName = 'fade'
      return
    }

    const newIndex = Number(to.meta.order)
    const oldIndex = Number(from.meta.order)
    if (isNaN(newIndex) || isNaN(oldIndex)) {
      to.meta.transitionName = 'fade'
      return
    }
    if (oldIndex < newIndex) {
      to.meta.transitionName = 'slide-left'
    } else {
      to.meta.transitionName = 'slide-right'
    }
  })
}
