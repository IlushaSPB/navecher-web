import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { fetchConfig, fetchItems, rub, type Item, type SiteConfig } from '../api'
import { useSaved } from '../useSaved'
import { useTheme } from '../theme'
import { hhmm, phrase } from '../sun'
import Icon, { type IconName } from './icons'
import { ProtoCtx, type Proto, type Route, type Tab } from './ctx'
import {
  EMPTY,
  firstEvening,
  fmtDay,
  fmtLong,
  loadStore,
  ownerOf,
  ownerReply,
  parseIso,
  refresh,
  RENTER_REPLY,
  saveStore,
  seed,
  type Booking,
  type Message,
  type Status,
  type Store,
} from './data'
import Home from './Home'
import Search from './Search'
import Bookings from './Bookings'
import Profile, { MineScreen, RulesScreen, SavedScreen } from './Profile'
import ItemScreen from './ItemScreen'
import Book from './Book'
import Chat from './Chat'
import Lend from './Lend'
import { Onboarding, Splash } from './Intro'
import './proto.css'

const NEXT: Partial<Record<Status, Status>> = { requested: 'confirmed', confirmed: 'met', met: 'returned' }

const TABS: [Tab | 'lend', string, IconName][] = [
  ['home', 'Сегодня', 'home'],
  ['search', 'Каталог', 'search'],
  ['lend', 'Сдать', 'plus'],
  ['bookings', 'Брони', 'bookings'],
  ['profile', 'Профиль', 'user'],
]

type Scene = 'home' | 'item' | 'book' | 'chat' | 'lend' | 'profile'

const SCENES: [Scene, string, string][] = [
  ['home', 'Главная', 'приветствие по закату, бронь, подборка, рядом'],
  ['item', 'Карточка вещи', 'фото, условия, владелица, свободные вечера'],
  ['book', 'Бронь', 'вечер, встреча или курьер, итог при встрече'],
  ['chat', 'Чат с владелицей', 'путь брони, быстрые ответы, оценка'],
  ['lend', 'Сдать вещь', 'пять шагов, подсказка цены как в боте'],
  ['profile', 'Профиль', 'заработок, мои вещи, режим «Авто / День / Вечер»'],
]

function useWide() {
  const query = '(min-width: 760px)'
  const [wide, setWide] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setWide(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return wide
}

// Prototype — кликабельный прототип мобильного приложения на странице /app.
// На компьютере — телефон в рамке и панель сценариев для показа, на телефоне — на весь экран.
export default function Prototype() {
  const [cfg, setCfg] = useState<SiteConfig | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [store, setStore] = useState<Store>(loadStore)
  const [tab, setTabState] = useState<Tab>('home')
  const [stack, setStack] = useState<Route[]>([])
  const [leaving, setLeaving] = useState(false)
  const [typing, setTyping] = useState<string | null>(null)
  const [toastText, setToastText] = useState<{ text: string; key: number } | null>(null)
  const [splash, setSplash] = useState(true)
  const saved = useSaved()
  const theme = useTheme()
  const wide = useWide()
  const timers = useRef<number[]>([])

  // later — таймер, который снимается при уходе со страницы; отработавшие убираются из списка
  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.current = timers.current.filter((t) => t !== id)
      fn()
    }, ms)
    timers.current.push(id)
  }, [])

  useEffect(() => {
    document.title = 'На вечер — прототип приложения'
    // на iPhone приложение заходит под вырез и полоску «домой»; отступы берём из safe-area
    document.querySelector('meta[name="viewport"]')?.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover')
    fetchConfig()
      .then(setCfg)
      .catch(() => setCfg(null))
    fetchItems('', 0, 50)
      .then((p) => setItems(p.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
    const t = window.setTimeout(() => setSplash(false), 1700)
    return () => {
      clearTimeout(t)
      timers.current.forEach(clearTimeout)
    }
  }, [])

  useEffect(() => {
    if (!loading) setStore((s) => (s.seeded ? refresh(items, s) : seed(items, s)))
  }, [loading, items])

  useEffect(() => saveStore(store), [store])

  // --- навигация ---

  const setTab = useCallback((t: Tab) => {
    setStack([])
    setTabState(t)
  }, [])
  const push = useCallback((r: Route) => setStack((s) => [...s, r]), [])
  const replace = useCallback((r: Route) => setStack((s) => [...s.slice(0, -1), r]), [])
  const pop = useCallback(() => {
    setLeaving(true)
    later(() => {
      setStack((s) => s.slice(0, -1))
      setLeaving(false)
    }, 300)
  }, [later])

  const toast = useCallback(
    (text: string) => {
      const key = Date.now()
      setToastText({ text, key })
      later(() => setToastText((t) => (t?.key === key ? null : t)), 1800)
    },
    [later],
  )

  // --- брони и чат (вторая сторона отвечает сама) ---

  const update = useCallback(
    (id: string, fn: (b: Booking) => Booking) => setStore((s) => ({ ...s, bookings: s.bookings.map((b) => (b.id === id ? fn(b) : b)) })),
    [],
  )
  const say = useCallback(
    (id: string, ...msgs: Omit<Message, 'at'>[]) =>
      update(id, (b) => ({ ...b, messages: [...b.messages, ...msgs.map((m) => ({ ...m, at: Date.now() }))] })),
    [update],
  )

  const book = useCallback<Proto['book']>(
    (item, date, time, method) => {
      const id = `b${Date.now()}`
      const b: Booking = {
        id,
        role: 'renter',
        peer: ownerOf(item).name,
        item,
        date,
        time,
        method,
        status: 'requested',
        messages: [{ from: 'system', text: `Запрос отправлен · ${fmtDay(parseIso(date))}, ${time}`, at: Date.now() }],
      }
      setStore((s) => ({ ...s, bookings: [b, ...s.bookings] }))
      later(() => setTyping(id), 900)
      later(() => {
        setTyping(null)
        update(id, (x) => ({ ...x, status: 'confirmed' }))
        say(
          id,
          {
            from: 'peer',
            text: `Привет! Да, ${fmtLong(parseIso(date))} свободно. ${
              method === 'metro' ? `Давайте у выхода из м. ${item.metro} в ${time}?` : `Отправлю курьером к ${time}.`
            }`,
          },
          { from: 'system', text: 'Владелица подтвердила бронь' },
        )
      }, 2700)
      return id
    },
    [later, say, update],
  )

  const send = useCallback<Proto['send']>(
    (id, text) => {
      const b = store.bookings.find((x) => x.id === id)
      if (!b) return
      say(id, { from: 'me', text })
      later(() => setTyping(id), 600)
      later(() => {
        setTyping(null)
        say(id, { from: 'peer', text: b.role === 'renter' ? ownerReply(text, b) : RENTER_REPLY })
      }, 2000)
    },
    [store.bookings, say, later],
  )

  const advance = useCallback<Proto['advance']>(
    (id) => {
      const b = store.bookings.find((x) => x.id === id)
      const next = b && NEXT[b.status]
      if (!b || !next) return
      const owner = b.role === 'owner'
      const text: Record<Status, string> = {
        requested: '',
        confirmed: owner ? 'Вы подтвердили бронь' : 'Бронь подтверждена',
        met: owner ? 'Вещь передана · залог у вас' : 'Встретились · хорошего вечера!',
        returned: owner ? `Вещь вернули · +${rub(b.item.priceRent)}` : 'Вещь вернули · владелица вернёт залог',
      }
      update(id, (x) => ({ ...x, status: next }))
      say(id, { from: 'system', text: text[next] })
      // владелица получила деньги за вечер — растёт заработок в «Моих вещах»
      if (owner && next === 'returned') {
        setStore((s) => ({
          ...s,
          mine: s.mine.map((m) => (m.itemId === b.item.id ? { ...m, rentals: m.rentals + 1, earned: m.earned + b.item.priceRent } : m)),
        }))
      }
    },
    [store.bookings, update, say],
  )

  const ctx: Proto = useMemo(
    () => ({
      cfg,
      items,
      loading,
      tab,
      setTab,
      push,
      pop,
      replace,
      saved,
      theme,
      bookings: store.bookings,
      typing,
      book,
      send,
      advance,
      rate: (id, stars) => {
        update(id, (b) => ({ ...b, rating: stars }))
        toast('Спасибо за оценку')
      },
      mine: store.mine,
      addMine: (m) => setStore((s) => ({ ...s, mine: [m, ...s.mine] })),
      togglePause: (id) => setStore((s) => ({ ...s, mine: s.mine.map((m) => (m.id === id ? { ...m, paused: !m.paused } : m)) })),
      toast,
    }),
    [cfg, items, loading, tab, setTab, push, pop, replace, saved, theme, store, typing, book, send, advance, update, toast],
  )

  // go — быстрый переход к сценарию из панели слева.
  const go = (scene: Scene) => {
    const it = items[2] ?? items[0]
    const seeded = store.bookings.find((b) => b.role === 'renter')
    setStack([])
    if (scene === 'profile') return setTabState('profile')
    if (scene === 'chat') {
      setTabState('bookings')
      if (seeded) setStack([{ name: 'chat', id: seeded.id }])
      return
    }
    setTabState('home')
    if (scene === 'lend') setStack([{ name: 'lend' }])
    if (scene === 'item' && it) setStack([{ name: 'item', item: it }])
    if (scene === 'book' && it)
      setStack([
        { name: 'item', item: it },
        { name: 'book', item: it, date: firstEvening(it) },
      ])
  }

  const reset = () => {
    setStore(EMPTY)
    setStack([])
    setTabState('home')
  }

  const route = (r: Route) => {
    switch (r.name) {
      case 'item':
        return <ItemScreen item={r.item} />
      case 'book':
        return <Book item={r.item} date={r.date} />
      case 'chat':
        return <Chat id={r.id} />
      case 'saved':
        return <SavedScreen />
      case 'mine':
        return <MineScreen />
      case 'lend':
        return <Lend />
      case 'rules':
        return <RulesScreen />
    }
  }

  const top = stack[stack.length - 1]
  const lightStatus = (!store.onboarded && !splash) || top?.name === 'item'
  const active = store.bookings.filter((b) => b.status !== 'returned').length

  const app = (
    <div className={`p-app${wide ? '' : ' p-app--bare'}`}>
      {wide && (
        <div className={`p-statusbar${lightStatus ? ' is-light' : ''}`} aria-hidden="true">
          <span>{hhmm(theme.evening.now)}</span>
          <span className="p-statusbar__icons">
            <svg viewBox="0 0 18 12" width="18" height="12">
              <rect x="0" y="8" width="3" height="4" rx="0.7" />
              <rect x="5" y="5.5" width="3" height="6.5" rx="0.7" />
              <rect x="10" y="3" width="3" height="9" rx="0.7" />
              <rect x="15" y="0" width="3" height="12" rx="0.7" />
            </svg>
            <svg viewBox="0 0 27 12" width="27" height="12">
              <rect x="0.5" y="0.5" width="23" height="11" rx="3.2" fill="none" stroke="currentColor" opacity="0.5" />
              <rect x="2" y="2" width="17" height="8" rx="2" />
              <rect x="24.8" y="4" width="1.6" height="4" rx="0.8" opacity="0.5" />
            </svg>
          </span>
        </div>
      )}

      <div className="p-tabview" key={tab}>
        {tab === 'home' && <Home />}
        {tab === 'search' && <Search />}
        {tab === 'bookings' && <Bookings />}
        {tab === 'profile' && <Profile />}
      </div>

      <nav className="p-tabs" aria-label="Разделы">
        {TABS.map(([t, label, icon]) =>
          t === 'lend' ? (
            <button key={t} type="button" className="p-tab p-tab--plus" onClick={() => push({ name: 'lend' })}>
              <span className="p-tab__plus">
                <Icon name="plus" />
              </span>
              <span>{label}</span>
            </button>
          ) : (
            <button key={t} type="button" className={`p-tab${tab === t ? ' is-active' : ''}`} onClick={() => setTab(t)}>
              <Icon name={icon} />
              <span>{label}</span>
              {t === 'bookings' && active > 0 && <span className="p-badge">{active}</span>}
            </button>
          ),
        )}
      </nav>

      {stack.map((r, i) => (
        <div
          key={`${i}-${r.name}`}
          className={`p-layer${r.name === 'lend' ? ' p-layer--up' : ''}${leaving && i === stack.length - 1 ? ' is-leaving' : ''}`}
        >
          {route(r)}
        </div>
      ))}

      {toastText && (
        <p key={toastText.key} className="p-toast" role="status">
          {toastText.text}
        </p>
      )}
      {!store.onboarded && !splash && <Onboarding onDone={() => setStore((s) => ({ ...s, onboarded: true }))} />}
      {splash && <Splash evening={theme.evening} />}
      {wide && <span className="p-homebar" aria-hidden="true" />}
    </div>
  )

  if (!wide) return <ProtoCtx.Provider value={ctx}>{app}</ProtoCtx.Provider>

  return (
    <ProtoCtx.Provider value={ctx}>
      <div className="proto">
        <aside className="proto__side">
          <a href="/" className="label proto__back">
            ← На сайт
          </a>
          <p className="proto__kicker">Прототип для iPhone и Android</p>
          <h1 className="proto__title">Приложение «На&nbsp;вечер»</h1>
          <p className="proto__lead">
            Кликабельный прототип. Каталог — живые демо-вещи с сайта; брони, чаты и «Сдать вещь» — имитация, всё сохраняется в этом
            браузере.
          </p>
          <ol className="proto__scenes">
            {SCENES.map(([s, title, text], i) => (
              <li key={s}>
                <button type="button" onClick={() => go(s)}>
                  <span className="label">0{i + 1}</span>
                  <span>
                    <span className="proto__scene">{title}</span>
                    <span className="proto__scene-text">{text}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </aside>

        <div className="device">
          <div className="device__screen">{app}</div>
          <span className="device__island" aria-hidden="true" />
        </div>

        <aside className="proto__notes">
          <p className="label">Москва, сейчас</p>
          <p className="proto__time">{hhmm(theme.evening.now)}</p>
          <p className="label">
            Закат в {hhmm(theme.evening.sunset)} · {phrase(theme.evening)}
          </p>
          <div className="proto__tips">
            <p className="label">Что попробовать</p>
            <p>Нажмите «Арендовать» в любой вещи — владелица ответит в чате через пару секунд.</p>
            <p>В чате спросите «где встретимся?» или «можно примерить?».</p>
            <p>В «Брони → Я сдаю» подтвердите запрос Ирины и проведите бронь до возврата.</p>
            <p>В профиле переключите «День / Вечер».</p>
          </div>
          <div className="proto__actions">
            <button type="button" className="label" onClick={() => setStore((s) => ({ ...s, onboarded: false }))}>
              Показать онбординг
            </button>
            <button type="button" className="label" onClick={reset}>
              Сбросить демо
            </button>
          </div>
        </aside>
      </div>
    </ProtoCtx.Provider>
  )
}
