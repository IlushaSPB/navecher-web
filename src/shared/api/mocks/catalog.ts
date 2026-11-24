import { http, HttpResponse } from 'msw'
import { isIsoDate, isIsoMonth, localToday } from '@/shared/lib/date'
import type { Availability, Item, ItemsPage } from '../types'
import { busyDays, isBusy } from './fixtures/availability'
import { ITEMS, toPreview } from './fixtures/items'
import { apiError, readId } from './respond'

type Filter = (item: Item) => boolean

// filtersFrom — фильтры ленты из query, как их понимает сервер; ошибка — ответ 400 validation.
function filtersFrom(params: URLSearchParams): Filter[] | Response {
  const date = params.get('date')
  const size = params.get('size')
  const color = params.get('color')
  const priceMax = params.get('priceMax')
  if (date && (!isIsoDate(date) || date < localToday())) {
    return apiError(400, 'validation', 'invalid filters', { date: 'must be a date not earlier than today' })
  }
  if (priceMax && !(Number(priceMax) > 0)) {
    return apiError(400, 'validation', 'invalid filters', { priceMax: 'must be a positive number' })
  }
  const filters: Filter[] = []
  if (date) filters.push((i) => !isBusy(i.id, date))
  if (size) filters.push((i) => i.size === size)
  if (color) filters.push((i) => i.color === color)
  if (priceMax) filters.push((i) => i.priceRent <= Number(priceMax))
  return filters
}

const findItem = (raw: string | readonly string[] | undefined) => ITEMS.find((i) => i.id === readId(raw))

export const catalogHandlers = [
  http.get('/api/items', ({ request }) => {
    const params = new URL(request.url).searchParams
    const filters = filtersFrom(params)
    if (filters instanceof Response) return filters
    const found = ITEMS.filter((item) => filters.every((f) => f(item)))
    const offset = Number(params.get('offset') ?? 0)
    const limit = Number(params.get('limit') ?? 24)
    const page = found.slice(offset, offset + limit).map(toPreview)
    return HttpResponse.json<ItemsPage>({ total: found.length, items: page })
  }),

  http.get('/api/items/:id', ({ params }) => {
    const item = findItem(params.id)
    return item ? HttpResponse.json<Item>(item) : apiError(404, 'not_found', 'item not found')
  }),

  http.get('/api/items/:id/availability', ({ params, request }) => {
    const item = findItem(params.id)
    if (!item) return apiError(404, 'not_found', 'item not found')
    const month = new URL(request.url).searchParams.get('month')
    if (!isIsoMonth(month)) return apiError(400, 'validation', 'invalid month', { month: 'expected YYYY-MM' })
    return HttpResponse.json<Availability>({ month, today: localToday(), busy: busyDays(item.id, month) })
  }),
]
