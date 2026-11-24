import { fetchItems, type ItemsQuery } from '@/shared/api'
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue'
import { useRequest } from '@/shared/lib/useRequest'

const DEBOUNCE_MS = 300

// useItemsTotal — сколько платьев подходит под фильтры: запрос с limit=1, берём total.
// Пока фильтры меняются, отдаёт прошлое число, чтобы кнопка не мигала.
export function useItemsTotal(query: ItemsQuery) {
  const key = JSON.stringify(query)
  const settled = useDebouncedValue(key, DEBOUNCE_MS)
  const { data, loading } = useRequest(
    `total:${settled}`,
    (signal) => fetchItems({ ...(JSON.parse(settled) as ItemsQuery), limit: 1, offset: 0 }, signal).then((p) => p.total),
    { keepPrevious: true },
  )
  return { total: data ?? null, pending: loading || settled !== key }
}
