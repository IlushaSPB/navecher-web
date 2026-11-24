import { isApiError } from '../errors'
import { request } from '../http'
import type { Availability, Item, ItemsPage, ItemsQuery } from '../types'

export const fetchItems = ({ limit = 24, offset = 0, ...rest }: ItemsQuery = {}, signal?: AbortSignal) =>
  request<ItemsPage>('/api/items', { query: { limit, offset, ...rest }, signal })

// fetchItem — одно платье; null, если его нет или сняли.
export async function fetchItem(id: number, signal?: AbortSignal): Promise<Item | null> {
  try {
    return await request<Item>(`/api/items/${id}`, { signal })
  } catch (e) {
    if (isApiError(e, 404)) return null
    throw e
  }
}

// fetchAvailability — занятые вечера платья за месяц YYYY-MM.
export const fetchAvailability = (id: number, month: string, signal?: AbortSignal) =>
  request<Availability>(`/api/items/${id}/availability`, { query: { month }, signal })
