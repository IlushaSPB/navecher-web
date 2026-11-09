import { rub, titleOf, type Item } from '../api'

// Данные прототипа приложения. Каталог — живой (демо-вещи из API);
// владелицы, свободные вечера, брони, чаты и «мои вещи» — имитация, хранится в браузере.

// --- владелица вещи (выдуманная, но стабильная для каждой вещи) ---

export type Owner = { name: string; rating: string; rentals: number; reply: string }

const NAMES = ['Алина', 'Вера', 'Ксения', 'Маша', 'Полина', 'Соня', 'Дарья', 'Ева', 'Лиза', 'Катя']
const REPLY = ['10 минут', '15 минут', 'полчаса', 'час']

export function ownerOf(it: Item): Owner {
  return {
    name: NAMES[it.id % NAMES.length],
    rating: (4.7 + (it.id % 4) * 0.1).toFixed(1),
    rentals: 3 + ((it.id * 7) % 17),
    reply: REPLY[it.id % REPLY.length],
  }
}

// walkMinutes — «12 мин от вас»: пешком до метро владелицы.
export const walkMinutes = (it: Item) => 6 + ((it.id * 5) % 19)

// --- даты ---

const DOW = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
const MON = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export function parseIso(s: string) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// fmtDay — «Пт, 31 окт»; fmtLong — «пятница, 31 октября».
export const fmtDay = (d: Date) => `${DOW[d.getDay()]}, ${d.getDate()} ${MON[d.getMonth()]}`
export const fmtLong = (d: Date) => d.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })
export const dow = (d: Date) => DOW[d.getDay()]

type Slot = { date: string; busy: boolean }

// slots — ближайшие две недели вечеров; часть занята (стабильно для каждой вещи).
export function slots(it: Item, days = 14): Slot[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    return { date: iso(d), busy: i > 0 && (it.id * 3 + i * 7) % 5 === 0 }
  })
}

// firstEvening — ближайшая свободная пятница, а если её нет — первый свободный вечер.
export function firstEvening(it: Item) {
  const all = slots(it)
  const free = all.filter((s) => !s.busy)
  return (free.find((s) => parseIso(s.date).getDay() === 5) ?? free[0] ?? all[0]).date
}

// --- брони и чат ---

export type Status = 'requested' | 'confirmed' | 'met' | 'returned'

export const STATUS: Record<Status, string> = {
  requested: 'Запрос отправлен',
  confirmed: 'Подтверждено',
  met: 'Вещь у арендатора',
  returned: 'Возвращено',
}

export const STEPS: [Status, string][] = [
  ['requested', 'Запрос'],
  ['confirmed', 'Встреча'],
  ['met', 'Вечер'],
  ['returned', 'Возврат'],
]

export type Message = { from: 'me' | 'peer' | 'system'; text: string; at: number }

export type Booking = {
  id: string
  role: 'renter' | 'owner' // я арендую или я сдаю
  peer: string // имя второй стороны
  item: Item
  date: string
  time: string
  method: 'metro' | 'courier'
  status: Status
  messages: Message[]
  rating?: number
}

export const COURIER = 500
export const TIMES = ['16:00', '17:00', '18:00', '18:30', '19:00']

// ownerReply — ответ владелицы на сообщение арендатора (по ключевым словам).
export function ownerReply(text: string, b: Booking) {
  const t = text.toLowerCase()
  if (/где|встрет|адрес|метро/.test(t)) return `Давайте у выхода из м. ${b.item.metro || 'Тверская'} в ${b.time}. Напишу, как подойду.`
  if (/пример/.test(t)) return 'Лучше заберите накануне и примерьте дома. Не подойдёт — верните в тот же день, залог отдам сразу.'
  if (/размер|подойд|сид/.test(t)) return `Это ${b.item.size || 'S'}, сидит в размер. Если вы между размерами — лучше примерить.`
  if (/курьер|достав/.test(t)) return 'В первый раз давайте встретимся лично — так спокойнее нам обеим. Курьером — уже в следующий раз.'
  if (/залог|деньг|оплат/.test(t))
    return b.item.deposit > 0
      ? `Залог ${rub(b.item.deposit)}, при встрече. Верну сразу, если платье в том же состоянии.`
      : 'Залога не нужно, оплата аренды при встрече.'
  return 'Хорошо! Если появятся вопросы — пишите.'
}

export const RENTER_QUICK = ['Где встретимся?', 'Можно примерить?', 'Подойдёт ли размер?', 'Как с залогом?']
export const OWNER_QUICK = ['Да, подойдёт', 'Встретимся у метро?', 'Залог при встрече']
export const RENTER_REPLY = 'Отлично, спасибо! Тогда до встречи.'

// --- мои вещи (сторона владелицы) ---

export type MyItem = {
  id: string
  itemId?: number // если вещь из каталога
  title: string
  categoryLabel: string
  size: string
  measurements?: string
  notes?: string
  priceRetail: number
  priceRent: number
  deposit: number
  metro: string
  photo: string
  rentals: number
  earned: number
  paused: boolean
}

function mineFromItem(it: Item, rentals: number): MyItem {
  return {
    id: `m${it.id}`,
    itemId: it.id,
    title: titleOf(it),
    categoryLabel: it.categoryLabel,
    size: it.size,
    measurements: it.measurements,
    notes: it.notes,
    priceRetail: it.priceRetail,
    priceRent: it.priceRent,
    deposit: it.deposit,
    metro: it.metro,
    photo: it.photos[0] ?? '',
    rentals,
    earned: rentals * it.priceRent,
    paused: false,
  }
}

// --- хранилище прототипа ---

export type Store = { seeded: boolean; onboarded: boolean; bookings: Booking[]; mine: MyItem[] }

// refresh — брони хранят копию вещи; после пересоздания демо id меняются, и у старых броней
// битые фото. Подменяем копии свежими вещами, а если вещей из броней больше нет — сеем заново.
export function refresh(items: Item[], s: Store): Store {
  if (!s.seeded || items.length < 3) return s
  const byId = new Map(items.map((it) => [it.id, it]))
  if (s.bookings.some((b) => !byId.has(b.item.id))) return seed(items, { ...EMPTY, onboarded: s.onboarded })
  return { ...s, bookings: s.bookings.map((b) => ({ ...b, item: byId.get(b.item.id)! })) }
}

export const EMPTY: Store = { seeded: false, onboarded: false, bookings: [], mine: [] }

const KEY = 'navecher:proto:v1'

export function loadStore(): Store {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as Store) } : EMPTY
  } catch {
    return EMPTY
  }
}

export function saveStore(s: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* хранилище недоступно или переполнено фото — работаем без сохранения */
  }
}

// seed — стартовые данные, чтобы прототип не был пустым: одна моя бронь,
// один запрос на мою вещь и две «мои» вещи из демо-каталога.
export function seed(items: Item[], s: Store): Store {
  if (items.length < 3) return s // пустой каталог — посеем, когда появятся вещи
  const now = Date.now()
  const rent = items[2]
  const myA = items[items.length - 1]
  const myB = items[Math.min(4, items.length - 2)]
  const rentDate = firstEvening(rent)
  const asked = slots(myA).filter((x) => !x.busy)[3]?.date ?? rentDate

  const renter: Booking = {
    id: 'seed-rent',
    role: 'renter',
    peer: ownerOf(rent).name,
    item: rent,
    date: rentDate,
    time: '18:30',
    method: 'metro',
    status: 'confirmed',
    messages: [
      { from: 'system', text: `Запрос отправлен · ${fmtDay(parseIso(rentDate))}, 18:30`, at: now - 7_200_000 },
      { from: 'peer', text: `Привет! Да, вечер свободен. Давайте у выхода из м. ${rent.metro} в 18:30?`, at: now - 7_000_000 },
      { from: 'me', text: 'Отлично, договорились!', at: now - 6_900_000 },
      { from: 'system', text: 'Владелица подтвердила бронь', at: now - 6_890_000 },
    ],
  }
  const owner: Booking = {
    id: 'seed-own',
    role: 'owner',
    peer: 'Ирина',
    item: myA,
    date: asked,
    time: '17:00',
    method: 'metro',
    status: 'requested',
    messages: [
      { from: 'system', text: `Новый запрос · ${fmtDay(parseIso(asked))}, 17:00`, at: now - 1_800_000 },
      { from: 'peer', text: 'Здравствуйте! Хочу взять на день рождения подруги. Мне обычно подходит S — сядет?', at: now - 1_700_000 },
    ],
  }
  return { ...s, seeded: true, bookings: [renter, owner], mine: [mineFromItem(myA, 4), mineFromItem(myB, 2)] }
}

// --- метро для шага «Где забрать» ---

export const METRO = [
  'Арбатская',
  'Аэропорт',
  'Бауманская',
  'Белорусская',
  'Динамо',
  'Добрынинская',
  'Киевская',
  'Китай-город',
  'Кропоткинская',
  'Курская',
  'Лубянка',
  'Маяковская',
  'Новослободская',
  'Октябрьская',
  'Охотный Ряд',
  'Павелецкая',
  'Парк культуры',
  'Полянка',
  'Пушкинская',
  'Савёловская',
  'Смоленская',
  'Сокол',
  'Спортивная',
  'Таганская',
  'Тверская',
  'Третьяковская',
  'Тургеневская',
  'Фрунзенская',
  'Цветной бульвар',
  'Чеховская',
  'Чистые пруды',
  'Шаболовская',
]

// shrinkPhoto — уменьшает выбранное фото до 900 px, чтобы «мои вещи» поместились в localStorage.
export function shrinkPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const k = Math.min(1, 900 / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * k)
      canvas.height = Math.round(img.height * k)
      canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.78))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('не удалось прочитать фото'))
    }
    img.src = url
  })
}
