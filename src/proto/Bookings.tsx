import { useState } from 'react'
import { titleOf } from '../api'
import { useProto } from './ctx'
import { fmtDay, parseIso, STATUS, type Booking } from './data'
import { Empty, Photo, Seg } from './ui'

// Bookings — брони с двух сторон: где я арендую и где сдаю свои вещи.
export default function Bookings() {
  const { bookings, push, setTab } = useProto()
  const [role, setRole] = useState<Booking['role']>('renter')
  const list = bookings.filter((b) => b.role === role)

  return (
    <div className="p-screen">
      <div className="p-pad">
        <h1 className="p-title">Брони</h1>
        <Seg
          value={role}
          onChange={setRole}
          label="Чьи брони"
          options={[
            ['renter', 'Я арендую'],
            ['owner', 'Я сдаю'],
          ]}
        />
      </div>

      {list.length === 0 ? (
        role === 'renter' ? (
          <Empty
            title="Пока без броней"
            text="Выберите платье в каталоге — владелица ответит в чате."
            action={
              <button type="button" className="p-btn p-btn--ghost" onClick={() => setTab('search')}>
                В каталог
              </button>
            }
          />
        ) : (
          <Empty
            title="Запросов пока нет"
            text="Когда кто-то захочет вашу вещь, запрос появится здесь."
            action={
              <button type="button" className="p-btn p-btn--ghost" onClick={() => push({ name: 'lend' })}>
                Сдать вещь
              </button>
            }
          />
        )
      ) : (
        <div className="p-pad-x">
          {list.map((b) => {
            const last = [...b.messages].reverse().find((m) => m.from !== 'system')
            return (
              <button key={b.id} type="button" className="p-booking" onClick={() => push({ name: 'chat', id: b.id })}>
                <span className="p-booking__thumb">
                  <Photo src={b.item.photos[0]} alt="" />
                </span>
                <span className="p-booking__text">
                  <span className={`p-status p-status--${b.status}`}>{STATUS[b.status]}</span>
                  <span className="p-booking__title">{titleOf(b.item)}</span>
                  <span className="p-booking__meta">
                    {fmtDay(parseIso(b.date))}, {b.time} · {b.role === 'renter' ? 'владелица' : 'арендует'} {b.peer}
                  </span>
                  {last && (
                    <span className="p-booking__last">
                      {last.from === 'me' ? 'Вы: ' : ''}
                      {last.text}
                    </span>
                  )}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
