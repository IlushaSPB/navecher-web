import { parseIsoDate, weekdayIndex, type IsoDate, type IsoMonth } from './date'

const num = new Intl.NumberFormat('ru-RU')
const oneDecimal = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

// rub — «4 500 ₽».
export const rub = (n: number) => `${num.format(n)} ₽`

// rating — «5,0».
export const rating = (n: number) => oneDecimal.format(n)

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

// Даты. Названия свои, а не Intl: нужны «Декабрь 2026» без «г.» и одинаковый вывод в любом браузере.
export const WEEKDAYS_SHORT = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'] as const
const WEEKDAYS = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'] as const
// prettier-ignore
const MONTHS = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'] as const
// prettier-ignore
const MONTHS_GEN = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'] as const

// weekdayShort — «сб».
export const weekdayShort = (date: IsoDate) => WEEKDAYS_SHORT[weekdayIndex(date)]

// dayMonth — «12 декабря».
export function dayMonth(date: IsoDate) {
  const p = parseIsoDate(date)
  return p ? `${p.d} ${MONTHS_GEN[p.m - 1]}` : ''
}

// dateShort — «сб, 12 декабря»; в начале фразы — capitalize(dateShort(d)).
export const dateShort = (date: IsoDate) => `${weekdayShort(date)}, ${dayMonth(date)}`

// dateLong — «суббота, 12 декабря»: подпись дня для скринридера.
export const dateLong = (date: IsoDate) => `${WEEKDAYS[weekdayIndex(date)]}, ${dayMonth(date)}`

// monthTitle — «Декабрь 2026».
export function monthTitle(month: IsoMonth) {
  const [y, m] = month.split('-').map(Number)
  return `${capitalize(MONTHS[m - 1] ?? '')} ${y}`
}

// plural — «1 раз», «2 раза», «5 раз».
export function plural(n: number, one: string, few: string, many: string) {
  const n10 = n % 10
  const n100 = n % 100
  if (n10 === 1 && n100 !== 11) return one
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return few
  return many
}

// nb — неразрывный пробел после коротких предлогов и союзов: «платье с разрезом»
// не разорвётся на «платье с / разрезом». Для текстов из данных (названия вещей).
export const nb = (s: string) => s.replace(/(^|[\s(«])(в|во|и|с|со|к|о|об|у|а|из|за|на|по|до|от|не|без)\s/gi, '$1$2 ')

// initials — «Мария Волкова» → «МВ».
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('')
