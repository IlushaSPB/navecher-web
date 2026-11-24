import { isApiError, request, type Availability, type Item, type ItemsPage, type ItemsQuery } from '@/shared/api'
import type { IsoMonth } from '@/shared/lib/date'

// Запросы платьев — обычные функции без React: их зовут хуки из model/ и тесты.

export const fetchItems = ({ limit = 24, offset = 0, ...rest }: ItemsQuery = {}, signal?: AbortSignal) =>
  request<ItemsPage>('/api/items', { query: { limit, offset, ...rest }, signal })

// fetchItem — одно платье; null, если его нет или сняли.
export async function fetchItem(id: number, signal?: AbortSignal): Promise<Item | null> {
  try {
    return await request<Item>(`/api/items/${id}`, { signal })
  } catch (e) {
    if (isApiError(e, 'not_found')) return null
    throw e
  }
}

// fetchAvailability — занятые вечера платья за месяц YYYY-MM.
export const fetchAvailability = (id: number, month: IsoMonth, signal?: AbortSignal) =>
  request<Availability>(`/api/items/${id}/availability`, { query: { month }, signal })

// fetchItemsTotal — сколько платьев подходит под фильтры: страница из одного платья, берём total.
export const fetchItemsTotal = async (query: ItemsQuery, signal?: AbortSignal): Promise<number> =>
  (await fetchItems({ ...query, limit: 1, offset: 0 }, signal)).total
