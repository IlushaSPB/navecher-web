import { useState } from 'react'
import { rub } from '../api'
import { hhmm } from '../sun'
import { RULES } from '../rules'
import Icon from './icons'
import { useProto } from './ctx'
import { Empty, Photo, Seg, Tile, TopBar } from './ui'

function MenuRow({ label, value, onClick }: { label: string; value?: string | number; onClick: () => void }) {
  return (
    <button type="button" className="p-menu__row" onClick={onClick}>
      <span>{label}</span>
      <span className="p-menu__value">
        {value !== undefined && <span className="label">{value}</span>}
        <Icon name="chevron" size={16} />
      </span>
    </button>
  )
}

// Profile — профиль: заработок владелицы, мои вещи, сохранённое и настройки
// (режим «Авто / День / Вечер» — тот же, что на сайте).
export default function Profile() {
  const { mine, saved, bookings, theme, push, setTab, toast } = useProto()
  const [notify, setNotify] = useState(true)
  const earned = mine.reduce((s, m) => s + m.earned, 0)
  const rentals = mine.reduce((s, m) => s + m.rentals, 0)

  return (
    <div className="p-screen">
      <div className="p-pad p-profile">
        <span className="p-avatar p-avatar--lg">А</span>
        <div>
          <h1 className="p-title">Анна</h1>
          <p className="label">Москва · в «На вечер» с октября</p>
        </div>
      </div>

      <dl className="p-stats">
        <div>
          <dt className="label">Вечеров</dt>
          <dd>{rentals}</dd>
        </div>
        <div>
          <dt className="label">Заработано</dt>
          <dd>{rub(earned)}</dd>
        </div>
        <div>
          <dt className="label">Рейтинг</dt>
          <dd>4,9</dd>
        </div>
      </dl>

      <div className="p-menu p-pad-x">
        <MenuRow label="Мои вещи" value={mine.length} onClick={() => push({ name: 'mine' })} />
        <MenuRow label="Сохранённое" value={saved.ids.length} onClick={() => push({ name: 'saved' })} />
        <MenuRow label="Брони" value={bookings.length} onClick={() => setTab('bookings')} />
      </div>

      <div className="p-pad-x">
        <p className="label p-field__label">Оформление</p>
        <Seg
          value={theme.mode}
          onChange={(v, el) => theme.setMode(v, el)}
          label="Оформление"
          options={[
            ['auto', 'Авто'],
            ['day', 'День'],
            ['night', 'Вечер'],
          ]}
        />
        <p className="p-note">Авто — светлое днём и вечернее после заката в Москве. Сегодня закат в {hhmm(theme.evening.sunset)}.</p>

        <div className="p-menu">
          <label className="p-toggle-row">
            <span>Уведомления о запросах</span>
            <input type="checkbox" className="p-toggle" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
          </label>
          <MenuRow label="Правила и залог" onClick={() => push({ name: 'rules' })} />
          <MenuRow label="Поддержка в Telegram" onClick={() => toast('Откроется чат поддержки')} />
        </div>
      </div>

      <p className="label p-pad p-version">Прототип · версия 0.1</p>
    </div>
  )
}

export function SavedScreen() {
  const { items, saved, pop, setTab } = useProto()
  const list = items.filter((it) => saved.has(it.id))

  return (
    <div className="p-page">
      <TopBar title="Сохранённое" onBack={pop} />
      <div className="p-page__scroll">
        {list.length ? (
          <div className="p-grid p-pad">
            {list.map((it) => (
              <Tile key={it.id} item={it} />
            ))}
          </div>
        ) : (
          <Empty
            title="Здесь пока пусто"
            text="Нажмите на сердце на фото — вещь сохранится здесь. Сохранённое на сайте тоже появится тут."
            action={
              <button
                type="button"
                className="p-btn p-btn--ghost"
                onClick={() => {
                  pop()
                  setTab('search')
                }}
              >
                В каталог
              </button>
            }
          />
        )}
      </div>
    </div>
  )
}

// RulesScreen — правила сделки, те же, что на сайте (/rules).
export function RulesScreen() {
  const { pop } = useProto()
  return (
    <div className="p-page">
      <TopBar title="Правила сделки" onBack={pop} />
      <div className="p-page__scroll p-pad p-rules">
        <p className="p-note">
          Сервис помогает найти друг друга, а договорённость — между владелицей и арендатором. Правила делают её предсказуемой.
        </p>
        {RULES.map((s) => (
          <section key={s.title} className="p-rules__section">
            <h2 className="p-h2">{s.title}</h2>
            <ul>
              {s.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}

export function MineScreen() {
  const { mine, pop, push, togglePause } = useProto()
  const earned = mine.reduce((s, m) => s + m.earned, 0)

  return (
    <div className="p-page">
      <TopBar
        title="Мои вещи"
        onBack={pop}
        right={
          <button type="button" className="p-iconbtn" onClick={() => push({ name: 'lend' })} aria-label="Сдать вещь">
            <Icon name="plus" />
          </button>
        }
      />
      <div className="p-page__scroll p-pad">
        <p className="label">Заработано за всё время</p>
        <p className="p-mine__total">{rub(earned)}</p>

        {mine.length === 0 ? (
          <Empty title="Пока ничего не сдано" text="Выставьте первую вещь — это пара минут." />
        ) : (
          mine.map((m) => (
            <div key={m.id} className={`p-mine${m.paused ? ' is-paused' : ''}`}>
              <span className="p-row__thumb">
                <Photo src={m.photo} alt="" />
              </span>
              <span className="p-row__text">
                <span className={`p-status p-status--${m.paused ? 'paused' : 'live'}`}>{m.paused ? 'На паузе' : 'В каталоге'}</span>
                <span className="p-row__title">{m.title}</span>
                <span className="p-row__meta">
                  {rub(m.priceRent)} / вечер · {m.rentals} аренд · {rub(m.earned)}
                </span>
              </span>
              <button type="button" className="p-chip" onClick={() => togglePause(m.id)}>
                {m.paused ? 'Вернуть' : 'Пауза'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
