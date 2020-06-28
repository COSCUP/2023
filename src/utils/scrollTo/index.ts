export type Position = { x: number; y: number }
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
  const from: Position = options.from ? (options.from instanceof HTMLElement ? (options.from.parentElement === container ? { x: options.from.scrollLeft, y: options.from.scrollTop } : { x: container.scrollLeft, y: container.scrollTop }) : options.from) : { x: container.scrollLeft, y: container.scrollTop }
  const { offset = { x: 0, y: 0 } } = options
  const to: Position | null = options.to instanceof HTMLElement ? { x: options.to.offsetLeft + offset.x, y: options.to.offsetTop + offset.y } : { x: options.to.x + offset.x, y: options.to.y + offset.y }
  if (to === null) return emptyResult
  const { duration = 500 } = options
  const delta = { x: to.x - from.x, y: to.y - from.y }
  const increment = 10
  let currentTime = 0
  let terminated = false

  return {
    promise: new Promise((resolve) => {
      function animateScroll () {
        currentTime += increment
        const value = {
          x: easeInOutQuad(currentTime, from.x, delta.x, duration),
          y: easeInOutQuad(currentTime, from.y, delta.y, duration)
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
