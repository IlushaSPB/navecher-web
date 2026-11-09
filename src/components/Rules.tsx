import { useEffect } from 'react'
import { RULES } from '../rules'
import Lines from './Lines'

// Rules — страница /rules: правила сделки простым языком. На неё ссылаются карточка вещи,
// бот (после «Свободно») и подвал.
export default function Rules() {
  useEffect(() => {
    document.title = 'Правила сделки — На вечер'
    document.documentElement.dataset.hero = 'past'
  }, [])

  return (
    <section className="rules wrap">
      <div className="sec-head">
        <p className="label">Правила сделки</p>
        <h1 className="sec-title" data-reveal="lines">
          <Lines lines={['Чтобы вечер', 'прошёл спокойно']} />
        </h1>
      </div>
      <p className="rules__lead">
        «На вечер» помогает найти друг друга, а договорённость — между владелицей и арендатором. Эти правила делают её предсказуемой: кто
        платит за химчистку, что удерживается из залога, как отменить.
      </p>
      <div className="rules__list">
        {RULES.map((s) => (
          <section key={s.title} className="rules__section" data-reveal>
            <h2 className="rules__title">{s.title}</h2>
            <ul>
              {s.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  )
}
