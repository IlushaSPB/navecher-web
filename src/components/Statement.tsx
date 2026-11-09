import { useRef } from 'react'
import { clamp, useScrollFrame } from '../useScrollFrame'
import Img from './Img'
import Lines from './Lines'

// Statement — пауза между каталогом и остальным: всегда вечерняя, ч/б шёлк в глубине.
// Фраза проявляется целиком, строками из-под маски; фон чуть смещается (параллакс).
export default function Statement() {
  const ref = useRef<HTMLElement>(null)

  useScrollFrame(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = el.getBoundingClientRect()
    const vh = window.innerHeight
    if (r.bottom < 0 || r.top > vh) return
    el.style.setProperty('--sp', clamp((vh - r.top) / (vh + r.height)).toFixed(4))
  })

  return (
    <section className="statement" data-theme="night" ref={ref}>
      <Img className="statement__bg" src="/editorial/satin.jpg" alt="" loading="lazy" aria-hidden="true" />
      <div className="wrap statement__inner">
        <p className="label">(02) Манифест</p>
        <p className="statement__text" data-reveal="lines">
          <Lines lines={['Платье, надетое один раз,', 'может прожить', 'ещё десять вечеров.']} />
        </p>
        <p className="statement__foot">Вещь не пылится в шкафу, владелица зарабатывает, а вам не нужно покупать платье на один вечер.</p>
      </div>
    </section>
  )
}
