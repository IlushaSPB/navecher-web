import { useState } from 'react'
import { DEPOSIT_RATES, num, RENT_RATES, round100, rub } from '../api'
import { LendLink } from '../site'
import Img from './Img'
import Lines from './Lines'
import Roll from './Roll'

const MIN = 5_000
const MAX = 150_000
const EVENINGS = 2 // для примера: честный ориентир на первый сезон, а не обещание

// OwnerSection — для владелиц: калькулятор, сколько приносит платье.
// Ставки и залог — те же, что подсказывает бот.
export default function OwnerSection() {
  const [price, setPrice] = useState(30_000)
  const [rate, setRate] = useState(15)

  const rent = round100((price * rate) / 100)
  const fill = ((price - MIN) / (MAX - MIN)) * 100
  const [depLow, depHigh] = DEPOSIT_RATES.map((p) => round100((price * p) / 100))

  return (
    <section className="section" id="owners">
      <div className="wrap owners">
        <div className="owners__media" data-reveal="img">
          <Img src="/editorial/closet.jpg" alt="Чёрное платье на вешалке у стены" loading="lazy" />
        </div>

        <div className="owners__body">
          <p className="label" data-reveal>
            (04) Владелицам
          </p>
          <h2 className="sec-title" data-reveal="lines">
            <Lines lines={['Платье в шкафу', 'может зарабатывать']} />
          </h2>
          <p className="owners__lead" data-reveal>
            Вы назначаете цену и сами решаете, кому сдать: запрос приходит в Telegram, контакты открываются после вашего «Свободно».
            Размещение бесплатное — вся сумма аренды ваша.
          </p>

          <div className="calc" data-reveal>
            <div className="calc__row">
              <label className="calc__label" htmlFor="calc-price">
                Цена платья в магазине
              </label>
              <output className="calc__value" htmlFor="calc-price">
                {rub(price)}
              </output>
            </div>
            <input
              id="calc-price"
              className="range"
              type="range"
              min={MIN}
              max={MAX}
              step={1_000}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              style={{ '--fill': `${fill}%` } as React.CSSProperties}
            />
            <div className="calc__row">
              <span className="calc__label">Ставка за вечер</span>
              <div className="seg" role="group" aria-label="Ставка за вечер">
                {RENT_RATES.map((r) => (
                  <button key={r} type="button" aria-pressed={rate === r} onClick={() => setRate(r)}>
                    {r}%
                  </button>
                ))}
              </div>
            </div>

            <dl className="calc__out">
              <div>
                <dt>За вечер</dt>
                <dd>{rub(rent)}</dd>
              </div>
              <div>
                <dt>Например, {EVENINGS} вечера</dt>
                <dd>{rub(rent * EVENINGS)}</dd>
              </div>
              <div>
                <dt>Залог</dt>
                <dd>
                  {num.format(depLow)}–{rub(depHigh)}
                </dd>
              </div>
            </dl>
            <p className="calc__note">
              Залог — {DEPOSIT_RATES.join('–')}% цены: примерно столько стоит перепродать вещь, поэтому он действительно защищает.
            </p>

            <LendLink className="btn">
              <Roll>Сдать платье</Roll>
            </LendLink>
          </div>
        </div>
      </div>
    </section>
  )
}
