import type { ItemsQuery } from '@/shared/api'
import type { IsoMonth } from '@/shared/lib/date'

// itemKeys — ключи кэша платьев: от общего к частному, чтобы сбрасывать разом (invalidate itemKeys.all).
export const itemKeys = {
  all: ['items'] as const,
  lists: () => [...itemKeys.all, 'list'] as const,
  list: (query: ItemsQuery) => [...itemKeys.lists(), query] as const,
  total: (query: ItemsQuery) => [...itemKeys.all, 'total', query] as const,
  detail: (id: number) => [...itemKeys.all, 'detail', id] as const,
  availability: (id: number, month: IsoMonth | null) => [...itemKeys.detail(id), 'availability', month] as const,
}
