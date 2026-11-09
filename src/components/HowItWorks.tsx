import { useRef, useState } from 'react'
import { clamp, useScrollFrame } from '../useScrollFrame'
import Lines from './Lines'

// Платье забирают накануне: так есть время спокойно примерить дома, а не у выхода из метро.
const MOMENTS = [
  {
    day: 'Понедельник',
    time: '12:40',
    title: 'Выбрали платье',
    text: 'Замеры, залог и метро — в карточке. Выбираете вечер в Telegram, владелица подтверждает, и вы получаете контакт.',
  },
  {
    day: 'Четверг',
    time: '19:30',
    title: 'Забрали накануне',
    text: 'У метро или в торговом центре. Оплата и залог — при встрече, без предоплаты. Примеряете дома.',
  },
  {
    day: 'Пятница',
    time: '19:00',
    title: 'Ваш вечер',
    text: 'Корпоратив, свадьба или свидание — в платье, которое вы не покупали.',
  },
  {
    day: 'Суббота',
    time: '14:00',
    title: 'Вернули',
    text: 'Владелица смотрит вещь и сразу возвращает залог. Понравилось — можно взять снова.',
  },
]

// HowItWorks — как проходит один вечер, по часам. Линия времени заполняется
// по мере прокрутки, моменты загораются, когда линия до них доходит.
export default function HowItWorks() {
  const ref = useRef<HTMLOListElement>(null)
  const [reached, setReached] = useState(0)

  useScrollFrame(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const r = el.getBoundingClientRect()
    const vh = window.innerHeight
    const p = reduce ? 1 : clamp((vh * 0.85 - r.top) / (vh * 0.6))
    el.style.setProperty('--p', p.toFixed(4))
    setReached(Math.floor(p * MOMENTS.length + 0.35))
  })

  return (
    <section className="section" id="how">
      <div className="wrap">
        <div className="sec-head">
          <p className="label" data-reveal>
            (03) Как это устроено
          </p>
          <h2 className="sec-title" data-reveal="lines">
            <Lines lines={['Один вечер', 'в четырёх моментах']} />
          </h2>
        </div>

        <ol className="moments" ref={ref}>
          {MOMENTS.map((m, i) => (
            <li key={m.time} className={`moment${i < reached ? ' is-on' : ''}${i === 2 ? ' moment--evening' : ''}`}>
              <p className="moment__day">{m.day}</p>
              <p className="moment__time">{m.time}</p>
              <h3 className="moment__title">{m.title}</h3>
              <p className="moment__text">{m.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
