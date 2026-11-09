import { useEffect } from 'react'

// useRevealAll — элементы с атрибутом data-reveal плавно появляются, когда доезжают
// до экрана. Новые элементы (каталог грузится асинхронно) подхватываются сами.
export function useRevealAll() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const show = (el: Element) => el.classList.add('is-in')

    if (reduce || !('IntersectionObserver' in window)) {
      const all = () => document.querySelectorAll('[data-reveal]').forEach(show)
      all()
      const mo = new MutationObserver(all)
      mo.observe(document.body, { childList: true, subtree: true })
      return () => mo.disconnect()
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            show(e.target)
            io.unobserve(e.target)
          }
        }
      },
      // порог по доле элемента, а не отступ от низа экрана: иначе блок
      // в самом конце страницы (большой логотип) никогда не «доезжает»
      { threshold: 0.12 },
    )
    const scan = () => document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el))
    scan()
    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])
}
