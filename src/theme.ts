import { useCallback, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { evening, type Evening } from './sun'

export type Theme = 'day' | 'night'

const KEY = 'navecher:theme'

// Ручной выбор режима живёт в браузере; хранилище может быть недоступно — тогда только авто.
function readOverride(): Theme | null {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'day' || v === 'night' ? v : null
  } catch {
    return null
  }
}

function writeOverride(t: Theme | null) {
  try {
    if (t) localStorage.setItem(KEY, t)
    else localStorage.removeItem(KEY)
  } catch {
    /* хранилище недоступно */
  }
}

const autoTheme = (e: Evening): Theme => (e.isEvening ? 'night' : 'day')

function applyTheme(t: Theme) {
  document.documentElement.dataset.theme = t
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'night' ? '#0e0d0c' : '#f2efe9')
}

// initTheme — до первого рендера, чтобы вечером не мигал светлый фон.
export function initTheme() {
  applyTheme(readOverride() ?? autoTheme(evening()))
}

type ViewTransitionDoc = Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } }

// useTheme — днём сайт светлый, после заката в Москве — вечерний. Переключатель в шапке
// перекрывает автоматику; выбор, совпавший с автоматикой, её снова включает.
export function useTheme() {
  const [ev, setEv] = useState(evening)
  const [override, setOverride] = useState(readOverride)
  const theme = override ?? autoTheme(ev)

  useEffect(() => {
    // часы показывают минуты — пересчитываем в начале каждой минуты
    let t = 0
    const schedule = () => {
      t = window.setTimeout(
        () => {
          setEv(evening())
          schedule()
        },
        60_000 - (Date.now() % 60_000) + 50,
      )
    }
    schedule()
    return () => clearTimeout(t)
  }, [])

  useEffect(() => applyTheme(theme), [theme])

  // apply — показать режим next и запомнить выбор (null — снова жить по закату).
  const apply = useCallback((next: Theme, value: Theme | null, origin?: HTMLElement | null) => {
    const run = () => {
      flushSync(() => setOverride(value))
      applyTheme(next)
      writeOverride(value)
    }

    const doc = document as ViewTransitionDoc
    if (!doc.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      run()
      return
    }
    // смена режима раскрывается кругом от переключателя
    const r = origin?.getBoundingClientRect()
    const x = r ? r.left + r.width / 2 : window.innerWidth - 80
    const y = r ? r.top + r.height / 2 : 32
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    doc
      .startViewTransition(run)
      .ready.then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 900, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
        )
      })
      // переход пропускается при двойном клике — режим уже переключён, ошибка не нужна
      .catch(() => undefined)
  }, [])

  // choose — переключатель «День / Вечер» в шапке сайта.
  const choose = useCallback(
    (next: Theme, origin?: HTMLElement | null) => apply(next, next === autoTheme(ev) ? null : next, origin),
    [apply, ev],
  )

  // setMode — явный выбор «Авто / День / Вечер» (настройки в приложении).
  const setMode = useCallback(
    (mode: Theme | 'auto', origin?: HTMLElement | null) =>
      apply(mode === 'auto' ? autoTheme(ev) : mode, mode === 'auto' ? null : mode, origin),
    [apply, ev],
  )

  return { theme, mode: override ?? ('auto' as const), evening: ev, choose, setMode }
}
