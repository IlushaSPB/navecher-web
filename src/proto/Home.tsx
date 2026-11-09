import { nb, rub, titleOf } from '../api'
import { hhmm, phrase } from '../sun'
import Img from '../components/Img'
import Icon from './icons'
import { useProto } from './ctx'
import { fmtDay, parseIso, walkMinutes } from './data'
import { Row, Tile } from './ui'

const today = () => new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })

// Home — «Вечер»: приветствие по московскому времени, ближайшая бронь,
// подборка, новое и вещи рядом.
export default function Home() {
  const { items, loading, theme, bookings, saved, push, setTab } = useProto()
  const ev = theme.evening
  const greeting =
    ev.now < ev.sunrise ? 'Доброй ночи' : ev.now < 12 * 60 ? 'Доброе утро' : ev.now < ev.sunset ? 'Добрый день' : 'Добрый вечер'
  const next = bookings.find((b) => b.role === 'renter' && b.status !== 'returned')
  const near = [...items].sort((a, b) => walkMinutes(a) - walkMinutes(b)).slice(0, 4)

  return (
    <div className="p-screen">
      <div className="p-home__bar">
        <span className="p-logo">На вечер</span>
        <button type="button" className="p-iconbtn" onClick={() => push({ name: 'saved' })} aria-label="Сохранённое">
          <Icon name="heart" />
          {saved.ids.length > 0 && <span className="p-badge">{saved.ids.length}</span>}
        </button>
      </div>

      <section className="p-hello p-pad">
        <p className="label">{today()} · Москва</p>
        <h1 className="p-hello__title">{greeting}</h1>
        <p className="label p-hello__sun">
          <span className="dot" aria-hidden="true" />
          Закат в {hhmm(ev.sunset)} · {phrase(ev)}
        </p>
      </section>

      {next && (
        <button type="button" className="p-next" onClick={() => push({ name: 'chat', id: next.id })}>
          <span className="p-next__thumb">
            <Img src={next.item.photos[0]} alt="" />
          </span>
          <span className="p-next__text">
            <span className="label">Ваша бронь · {fmtDay(parseIso(next.date))}</span>
            <span className="p-next__title">{nb(titleOf(next.item))}</span>
            <span className="p-next__meta">
              {next.method === 'metro' ? `Встреча в ${next.time} · м. ${next.item.metro}` : `Курьер к ${next.time}`}
            </span>
          </span>
          <Icon name="chevron" size={18} />
        </button>
      )}

      <button type="button" className="p-feature" onClick={() => setTab('search')}>
        <Img src="/editorial/hero.jpg" alt="" />
        <span className="p-feature__text">
          <span className="label">Подборка недели</span>
          <span className="p-feature__title">Сезон корпоративов</span>
          <span className="p-feature__more">Смотреть {items.length} →</span>
        </span>
      </button>

      <section className="p-section">
        <div className="p-section__head p-pad-x">
          <h2 className="p-h2">Новое</h2>
          <button type="button" className="label p-link" onClick={() => setTab('search')}>
            Все
          </button>
        </div>
        <div className="p-rail">
          {loading
            ? Array.from({ length: 3 }, (_, i) => <span key={i} className="p-tile p-skel" />)
            : items.slice(0, 6).map((it) => <Tile key={it.id} item={it} />)}
        </div>
      </section>

      <section className="p-section p-pad-x">
        <div className="p-section__head">
          <h2 className="p-h2">Рядом с вами</h2>
          <span className="label">пешком до метро</span>
        </div>
        {near.map((it) => (
          <Row
            key={it.id}
            photo={it.photos[0]}
            title={titleOf(it)}
            meta={`м. ${it.metro} · ${walkMinutes(it)} мин`}
            right={rub(it.priceRent)}
            onClick={() => push({ name: 'item', item: it })}
          />
        ))}
      </section>

      <button type="button" className="p-promo" onClick={() => push({ name: 'lend' })}>
        <span className="p-promo__img">
          <Img src="/editorial/closet.jpg" alt="" />
        </span>
        <span className="p-promo__text">
          <span className="label">Ваш шкаф</span>
          <span className="p-promo__title">Платье висит без дела? Пусть зарабатывает</span>
          <span className="p-promo__cta">Сдать вещь →</span>
        </span>
      </button>
    </div>
  )
}
