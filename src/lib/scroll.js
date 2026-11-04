// Tiny shared store so the WebGL scene can read scroll + pointer
// without triggering React re-renders.
export const scrollState = {
  progress: 0,
  mouse: { x: 0, y: 0 },
  lenis: null,
  introDone: false,
}

/** Delay for intro animations: full length on first load (behind the loader), short afterwards. */
export const intro = (seconds) => (scrollState.introDone ? Math.max(0, seconds - 2.2) : seconds)

export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (scrollState.lenis) scrollState.lenis.scrollTo(el, { offset: -10, duration: 1.4 })
  else el.scrollIntoView({ behavior: 'smooth' })
}
