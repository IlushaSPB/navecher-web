import { useRef, useState } from 'react'
import { hhmm, type Evening } from '../sun'
import Img from '../components/Img'

// Splash — заставка при запуске: логотип поднимается, под ним время заката.
export function Splash({ evening }: { evening: Evening }) {
  return (
    <div className="p-splash" aria-hidden="true">
      <p className="p-splash__logo">
        <span>На вечер</span>
      </p>
      <p className="label">Москва · закат в {hhmm(evening.sunset)}</p>
    </div>
  )
}

const SLIDES = [
  {
    img: '/editorial/hero.jpg',
    title: 'Платье на вечер — из шкафа другой девушки',
    text: 'Вечерние наряды девушек Москвы за 10–15% их цены.',
  },
  {
    img: '/editorial/satin.jpg',
    title: 'Без предоплаты',
    text: 'Встречаетесь у метро, примеряете и платите на месте. Залог возвращается.',
  },
  {
    img: '/editorial/closet.jpg',
    title: 'Ваш шкаф зарабатывает',
    text: 'Сдайте платье, которое надели один раз. Это пара минут.',
  },
]

// Onboarding — три экрана при первом запуске, листаются пальцем или кнопкой.
export function Onboarding({ onDone }: { onDone: () => void }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [i, setI] = useState(0)
  const last = i === SLIDES.length - 1

  const next = () => {
    if (last) return onDone()
    const el = trackRef.current
    el?.scrollTo({ left: el.clientWidth * (i + 1), behavior: 'smooth' })
  }

  return (
    <div className="p-onb">
      <div
        className="p-onb__track"
        ref={trackRef}
        onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
      >
        {SLIDES.map((s, n) => (
          <section key={s.img} className="p-onb__slide">
            <span className="p-onb__img">
              <Img src={s.img} alt="" />
            </span>
            <div className="p-onb__text">
              <p className="label">
                0{n + 1} / 0{SLIDES.length}
              </p>
              <h2 className="p-onb__title">{s.title}</h2>
              <p className="p-note">{s.text}</p>
            </div>
          </section>
        ))}
      </div>
      <button type="button" className="p-onb__skip label" onClick={onDone}>
        Пропустить
      </button>
      <div className="p-onb__bottom">
        <span className="p-onb__dots" aria-hidden="true">
          {SLIDES.map((s, n) => (
            <span key={s.img} className={n === i ? 'is-on' : undefined} />
          ))}
        </span>
        <button type="button" className="p-btn" onClick={next}>
          {last ? 'Начать' : 'Дальше'}
        </button>
      </div>
    </div>
  )
}
