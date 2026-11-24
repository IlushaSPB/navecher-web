// Яндекс Метрика: подключается, только если в настройках есть номер счётчика (METRIKA_ID).
// Цели: rent_click — «Арендовать», lend_click — «Сдать вещь».

type Ym = ((id: number, method: string, ...args: unknown[]) => void) & { a?: unknown[][]; l?: number }

let counter = 0

export function initMetrics(id: string) {
  const n = Number(id)
  if (!n || counter) return
  counter = n
  const w = window as Window & { ym?: Ym }
  // официальный загрузчик: очередь вызовов до загрузки tag.js
  const ym: Ym = Object.assign((...args: unknown[]) => void (ym.a = ym.a ?? []).push(args), { l: Date.now() })
  w.ym = w.ym ?? ym
  const s = document.createElement('script')
  s.async = true
  s.src = 'https://mc.yandex.ru/metrika/tag.js'
  document.head.appendChild(s)
  w.ym(n, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, defer: true })
}

function call(method: string, ...args: unknown[]) {
  const w = window as Window & { ym?: Ym }
  if (counter && w.ym) w.ym(counter, method, ...args)
}

// hit — просмотр страницы в SPA: счётчик в режиме defer сам их не считает.
export const hit = (url: string) => call('hit', url)

export const goal = (name: 'rent_click' | 'lend_click') => call('reachGoal', name)
