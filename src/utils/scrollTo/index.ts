export type Position = { left: number; top: number }
interface ScrollToOptions {
  container?: HTMLElement | null;
  from?: HTMLElement | Position | null;
  to: HTMLElement | Position | null;
  duration?: number;
  offset?: Position;
}

function easeInOutQuad (currentTime: number, start: number, delta: number, duration: number) {
  currentTime /= duration / 2
  if (currentTime < 1) return delta / 2 * currentTime * currentTime + start
  currentTime--
  return -delta / 2 * (currentTime * (currentTime - 2) - 1) + start
}

export function scrollTo (options: ScrollToOptions) {
  const emptyResult = {
    promise: Promise.resolve(),
    cancel: () => { /**/ }
  }
  if (options.to === null) return emptyResult

  const container: HTMLElement = options.container || document.documentElement
  const from: Position = options.from ? (options.from instanceof HTMLElement ? (options.from.parentElement === container ? { left: options.from.scrollLeft, top: options.from.scrollTop } : { left: container.scrollLeft, top: container.scrollTop }) : options.from) : { left: container.scrollLeft, top: container.scrollTop }
  const { offset = { left: 0, top: 0 } } = options
  const to: Position | null = options.to instanceof HTMLElement ? { left: options.to.offsetLeft + offset.left, top: options.to.offsetTop + offset.top } : { left: options.to.left + offset.left, top: options.to.top + offset.top }
  if (to === null) return emptyResult
  const { duration = 500 } = options
  const delta: Position = { left: to.left - from.left, top: to.top - from.top }
  const increment = 10
  let currentTime = 0
  let terminated = false

  return {
    promise: new Promise((resolve) => {
      function animateScroll () {
        currentTime += increment
        const value = {
          x: easeInOutQuad(currentTime, from.left, delta.left, duration),
          y: easeInOutQuad(currentTime, from.top, delta.top, duration)
        }
        container.scrollTo(value.x, value.y)

        if (!terminated && currentTime < duration) {
          window.setTimeout(() => requestAnimationFrame(animateScroll), increment)
        } else {
          resolve()
        }
      }
      requestAnimationFrame(animateScroll)
    }),
    cancel: () => { terminated = true }
  }
}
