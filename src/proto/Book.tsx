import { useState } from 'react'
import { rub, titleOf, type Item } from '../api'
import { useProto } from './ctx'
import { COURIER, fmtLong, ownerOf, parseIso, TIMES, type Booking } from './data'
import { Chips, DateStrip, Photo, Seg, TopBar } from './ui'

// Book — оформление брони: вечер, способ передачи, время и итог к оплате при встрече.
export default function Book({ item, date: initial }: { item: Item; date: string }) {
  const { pop, book, replace } = useProto()
  const [date, setDate] = useState(initial)
  const [method, setMethod] = useState<Booking['method']>('metro')
  const [time, setTime] = useState('18:30')
  const courier = method === 'courier' ? COURIER : 0
  const title = titleOf(item)
  const owner = ownerOf(item)

  return (
    <div className="p-page">
      <TopBar title="Бронь" onBack={pop} />
      <div className="p-page__scroll">
        <div className="p-pad">
          <div className="p-mini">
            <span className="p-mini__thumb">
              <Photo src={item.photos[0]} alt="" />
            </span>
            <span>
              <span className="p-mini__title">{title}</span>
              <span className="p-mini__meta">
                {item.size} · владелица {owner.name}
              </span>
            </span>
          </div>

          <p className="p-field__label">Вечер</p>
          <p className="p-book__date">{fmtLong(parseIso(date))}</p>
        </div>
        <DateStrip item={item} value={date} onChange={setDate} />

        <div className="p-pad">
          <p className="p-field__label">Как передать</p>
          <Seg
            value={method}
            onChange={setMethod}
            label="Как передать"
            options={[
              ['metro', 'Встреча у метро'],
              ['courier', 'Курьер (2-й раз)'],
            ]}
          />
          <p className="p-note">
            {method === 'metro'
              ? `м. ${item.metro}, накануне вечера — дома спокойно примерите.`
              : `Только если вы уже встречались лично. Яндекс Доставка, около ${rub(COURIER)} — оплачиваете вы.`}
          </p>

          <p className="p-field__label">{method === 'metro' ? 'Время встречи' : 'Привезти к'}</p>
        </div>
        <div className="p-scroll-x">
          <Chips value={time} onChange={setTime} label="Время" options={TIMES.map((t): [string, string] => [t, t])} />
        </div>

        <div className="p-pad">
          <dl className="p-receipt">
            <div>
              <dt>Аренда за вечер</dt>
              <dd>{rub(item.priceRent)}</dd>
            </div>
            <div>
              <dt>Залог · вернётся при той же вещи</dt>
              <dd>{item.deposit > 0 ? rub(item.deposit) : '—'}</dd>
            </div>
            {courier > 0 && (
              <div>
                <dt>Курьер</dt>
                <dd>{rub(courier)}</dd>
              </div>
            )}
            <div className="p-receipt__total">
              <dt>При встрече</dt>
              <dd>{rub(item.priceRent + item.deposit + courier)}</dd>
            </div>
          </dl>
          <p className="p-note">Сейчас ничего не списываем. Владелица ответит, обычно за {owner.reply}, — и откроется её контакт.</p>
        </div>
      </div>

      <div className="p-cta">
        <button type="button" className="p-btn p-btn--block" onClick={() => replace({ name: 'chat', id: book(item, date, time, method) })}>
          Отправить запрос владелице
        </button>
      </div>
    </div>
  )
}
