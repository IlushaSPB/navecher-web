import { useEffect, useRef } from 'react'

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))

// useScrollFrame — вызывает fn не чаще раза в кадр при прокрутке и ресайзе, и сразу при монтировании.
// Анимации, привязанные к прокрутке, пишут CSS-переменные напрямую, без перерисовки React.
export function useScrollFrame(fn: () => void) {
  const ref = useRef(fn)
  ref.current = fn

  useEffect(() => {
    let raf = 0
    const run = () => {
      raf = 0
      ref.current()
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(run)
    }
    run()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
}
