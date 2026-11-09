import { useEffect, useRef, useState } from 'react'
import { titleOf } from '../api'
import Icon from './icons'
import { useProto } from './ctx'
import { fmtDay, OWNER_QUICK, parseIso, RENTER_QUICK, STEPS, type Booking } from './data'
import { Empty, Photo, TopBar } from './ui'

// следующий шаг брони — кнопка над полем ввода (у арендатора и владелицы свои)
function nextAction(b: Booking) {
  if (b.role === 'renter') return b.status === 'confirmed' ? 'Мы встретились' : b.status === 'met' ? 'Я вернула вещь' : null
  return b.status === 'requested'
    ? 'Подтвердить бронь'
    : b.status === 'confirmed'
      ? 'Передала вещь'
      : b.status === 'met'
        ? 'Вещь вернули'
        : null
}

// Chat — переписка по брони: путь брони по шагам, сообщения, быстрые ответы.
// Вторая сторона отвечает сама (имитация) — можно спросить «где встретимся?».
export default function Chat({ id }: { id: string }) {
  const { bookings, typing, send, advance, rate, pop, push } = useProto()
  const b = bookings.find((x) => x.id === id)
  const [text, setText] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [b?.messages.length, typing])

  if (!b) {
    return (
      <div className="p-page">
        <TopBar onBack={pop} />
        <Empty title="Бронь не найдена" text="Возможно, демо сбросили." />
      </div>
    )
  }

  const step = STEPS.findIndex(([s]) => s === b.status)
  const action = nextAction(b)
  const quick = b.role === 'renter' ? RENTER_QUICK : OWNER_QUICK
  const submit = (t: string) => {
    if (!t.trim()) return
    send(b.id, t.trim())
    setText('')
  }

  return (
    <div className="p-page p-chat">
      <TopBar
        title={b.peer}
        onBack={pop}
        right={
          <button type="button" className="p-chat__item" onClick={() => push({ name: 'item', item: b.item })} aria-label="Открыть вещь">
            <Photo src={b.item.photos[0]} alt="" />
          </button>
        }
      />

      <div className="p-chat__head">
        <ol className="p-steps" aria-label="Путь брони">
          {STEPS.map(([s, label], i) => (
            <li key={s} className={i <= step ? 'is-done' : undefined}>
              <span>{label}</span>
            </li>
          ))}
        </ol>
        <p className="p-chat__sub">
          {titleOf(b.item)} · {fmtDay(parseIso(b.date))}, {b.time} · {b.method === 'metro' ? `м. ${b.item.metro}` : 'курьер'}
        </p>
      </div>

      <div className="p-msgs" ref={listRef}>
        {b.messages.map((m, i) =>
          m.from === 'system' ? (
            <p key={i} className="p-msg--system">
              {m.text}
            </p>
          ) : (
            <p key={i} className={`p-msg p-msg--${m.from}`}>
              {m.text}
            </p>
          ),
        )}
        {typing === b.id && (
          <p className="p-msg p-msg--peer p-typing" aria-label={`${b.peer} печатает`}>
            <span />
            <span />
            <span />
          </p>
        )}
        {b.status === 'returned' && b.role === 'renter' && (
          <div className="p-rate">
            <p className="p-rate__title">Оцените {b.peer}</p>
            <div className="p-rate__stars">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={(b.rating ?? 0) >= n ? 'is-on' : undefined}
                  onClick={() => rate(b.id, n)}
                  aria-label={`${n} из 5`}
                >
                  <Icon name="star" size={26} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-chat__bottom">
        {action && (
          <button type="button" className="p-btn p-btn--block p-chat__action" onClick={() => advance(b.id)}>
            {action}
          </button>
        )}
        <div className="p-quick">
          {quick.map((q) => (
            <button key={q} type="button" className="p-chip" onClick={() => submit(q)}>
              {q}
            </button>
          ))}
        </div>
        <form
          className="p-input"
          onSubmit={(e) => {
            e.preventDefault()
            submit(text)
          }}
        >
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Сообщение" aria-label="Сообщение" />
          <button type="submit" className="p-iconbtn" aria-label="Отправить" disabled={!text.trim()}>
            <Icon name="send" />
          </button>
        </form>
      </div>
    </div>
  )
}
