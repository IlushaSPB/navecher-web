import type { ItemsQuery } from '@/shared/api'
import { isIsoDate, type IsoDate } from '@/shared/lib/date'

// CatalogFilters — фильтры ленты; живут в адресе (?date=&size=&priceMax=&color=), null — не задан.
export type CatalogFilters = {
  date: IsoDate | null
  size: string | null
  priceMax: number | null
  color: string | null
}

export const EMPTY_FILTERS: CatalogFilters = { date: null, size: null, priceMax: null, color: null }

const KEYS = Object.keys(EMPTY_FILTERS) as Array<keyof CatalogFilters>

// readFilters — фильтры из адреса; мусор и прошедшая дата отбрасываются, иначе сервер ответит 400.
export function readFilters(params: URLSearchParams, today: IsoDate): CatalogFilters {
  const date = params.get('date')
  const price = Number(params.get('priceMax'))
  return {
    date: isIsoDate(date) && date >= today ? date : null,
    size: params.get('size') || null,
    priceMax: Number.isInteger(price) && price > 0 ? price : null,
    color: params.get('color') || null,
  }
}

// writeFilters — новые параметры адреса: фильтры заменены, остальные параметры не тронуты.
export function writeFilters(base: URLSearchParams, filters: Partial<CatalogFilters>): URLSearchParams {
  const next = new URLSearchParams(base)
  for (const key of KEYS) {
    if (!(key in filters)) continue
    const value = filters[key]
    if (value === null || value === undefined || value === '') next.delete(key)
    else next.set(key, String(value))
  }
  return next
}

export const toItemsQuery = ({ date, size, priceMax, color }: CatalogFilters): ItemsQuery => ({
  date: date ?? undefined,
  size: size ?? undefined,
  priceMax: priceMax ?? undefined,
  color: color ?? undefined,
})
