// Календарные даты без времени и часовых поясов: день — строка YYYY-MM-DD, месяц — YYYY-MM.
// Строки сравниваются лексикографически, поэтому «раньше/позже» — обычное < и >.

export type IsoDate = string
export type IsoMonth = string

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/
const MONTH_RE = /^(\d{4})-(\d{2})$/

const pad = (n: number) => String(n).padStart(2, '0')

// дата в UTC: так день недели и сдвиги не зависят от пояса устройства
const utc = (y: number, m: number, d: number) => new Date(Date.UTC(y, m - 1, d))

const fromUtc = (d: Date): IsoDate => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`

export function parseIsoDate(s: string): { y: number; m: number; d: number } | null {
  const match = DATE_RE.exec(s)
  if (!match) return null
  const [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])]
  const date = utc(y, m, d)
  if (date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return null
  return { y, m, d }
}

export const isIsoDate = (s: string | null | undefined): s is IsoDate => !!s && parseIsoDate(s) !== null

export const isIsoMonth = (s: string | null | undefined): s is IsoMonth => {
  const match = s ? MONTH_RE.exec(s) : null
  return !!match && Number(match[2]) >= 1 && Number(match[2]) <= 12
}

// localToday — сегодня по часам устройства; запасной вариант, пока нет даты сервера.
export function localToday(): IsoDate {
  const now = new Date()
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

export const monthOf = (date: IsoDate): IsoMonth => date.slice(0, 7)

export function addMonths(month: IsoMonth, n: number): IsoMonth {
  const [y, m] = month.split('-').map(Number)
  const d = utc(y, m + n, 1)
  return fromUtc(d).slice(0, 7)
}

// weekdayIndex — день недели с понедельника: 0 — пн, 6 — вс.
export function weekdayIndex(date: IsoDate): number {
  const p = parseIsoDate(date)
  if (!p) return 0
  return (utc(p.y, p.m, p.d).getUTCDay() + 6) % 7
}

export type MonthCell = { date: IsoDate; day: number; inMonth: boolean }

// monthGrid — полные недели месяца с понедельника, с днями соседних месяцев по краям.
export function monthGrid(month: IsoMonth): MonthCell[] {
  const [y, m] = month.split('-').map(Number)
  const first = utc(y, m, 1)
  const lead = (first.getUTCDay() + 6) % 7
  const daysInMonth = utc(y, m + 1, 0).getUTCDate()
  const total = Math.ceil((lead + daysInMonth) / 7) * 7
  return Array.from({ length: total }, (_, i) => {
    const d = utc(y, m, 1 - lead + i)
    return { date: fromUtc(d), day: d.getUTCDate(), inMonth: d.getUTCMonth() === m - 1 }
  })
}
