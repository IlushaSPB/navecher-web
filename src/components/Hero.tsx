import { useEffect, useRef, useState } from 'react'
import { fetchItems, num, rub, titleOf, type Item } from '../api'
import { clamp, useScrollFrame } from '../useScrollFrame'
import { LendLink, useSite } from '../site'
import Img from './Img'
import Roll from './Roll'

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// fetchpriority React 18 ещё не знает (предупреждает в dev) — передаём атрибут как есть.
const eager = { fetchpriority: 'high' } as Record<string, string>

// Hero — первый экран «прилипает», пока его листают: окно с фото в центре раскрывается
// на весь экран и раздвигает огромный логотип, затем поверх кадра выезжает заголовок.
// Ход анимации — CSS-переменные --e (раскрытие окна) и --q (заголовок), от 0 до 1.
// Предложение с ценой видно сразу, без прокрутки — и на телефоне тоже.
export default function Hero() {
  const { cfg } = useSite()
  const ref = useRef<HTMLElement>(null)
  const [still] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [latest, setLatest] = useState<Item | null>(null)

  useEffect(() => {
    fetchItems('', 0, 1)
      .then((p) => setLatest(p.items[0] ?? null))
      .catch(() => setLatest(null))
  }, [])

  useScrollFrame(() => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const vh = window.innerHeight
    const p = still ? 1 : clamp(-r.top / Math.max(1, r.height - vh))
    const e = still ? 1 : easeInOut(clamp(p / 0.5))
    const q = still ? 1 : clamp((p - 0.45) / 0.45)
    el.style.setProperty('--e', e.toFixed(4))
    el.style.setProperty('--q', q.toFixed(4))
    el.dataset.over = q > 0.5 ? '1' : '0'
    // светлая шапка — только когда фото закрыло весь верх; пока по краям бумага — шапка на фоне
    document.documentElement.dataset.hero = r.bottom <= 64 ? 'past' : e > 0.97 ? 'image' : e > 0.5 ? 'veil' : 'paper'
  })

  const offer = cfg?.minRent ? `от ${num.format(cfg.minRent)} ₽ за вечер` : 'за 10–15% цены вещи'

  return (
    <section className={`hero${still ? ' hero--still' : ''}`} id="top" ref={ref}>
      <div className="hero__stage">
        <p className="hero__word hero__word--na" aria-hidden="true">
          <span>На</span>
        </p>
        <p className="hero__word hero__word--vecher" aria-hidden="true">
          <span>вечер</span>
        </p>

        <div className="hero__intro">
          <div className="hero__lead">
            <p>Аренда вечерних платьев в&nbsp;Москве — {offer}. Платья девушек, надетые один-два раза.</p>
            <a className="hero__lead-link" href="#catalog">
              <Roll>Смотреть каталог</Roll>
              <span aria-hidden="true">↓</span>
            </a>
          </div>
          <p className="hero__hint label" aria-hidden="true">
            Листайте
          </p>
        </div>

        <div className="hero__window">
          <div className="hero__curtain">
            <picture>
              <source media="(max-width: 860px)" srcSet="/editorial/hero-m.jpg" />
              <img className="img is-loaded" src="/editorial/hero.jpg" alt="Платье на вешалке у окна" {...eager} />
            </picture>
          </div>
          <div className="hero__scrim" aria-hidden="true" />
        </div>

        <div className="hero__over">
          <p className="hero__kicker label">Сезон корпоративов</p>
          <h1 className="hero__title">
            <span className="line">
              <span>Платье на&nbsp;вечер —</span>
            </span>
            <span className="line">
              <span>из&nbsp;шкафа другой девушки</span>
            </span>
          </h1>
          <div className="hero__bottom">
            <div className="hero__actions">
              <a className="btn btn--light" href="#catalog">
                <Roll>Смотреть каталог</Roll>
              </a>
              <LendLink className="hero__link">Сдать свою вещь</LendLink>
            </div>
            {latest && (
              <a className="hero__card" href={`#item-${latest.id}`}>
                {latest.photos[0] && <Img src={latest.photos[0]} alt="" />}
                <span className="hero__card-text">
                  <span className="hero__card-label">Новое в каталоге</span>
                  <span className="hero__card-title">{titleOf(latest)}</span>
                  <span className="hero__card-price">{rub(latest.priceRent)} за вечер</span>
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
