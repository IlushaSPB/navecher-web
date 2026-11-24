import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { ItemsQuery } from '@/shared/api'
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue'
import { fetchItemsTotal } from '../api/api'
import { itemKeys } from '../api/keys'

const DEBOUNCE_MS = 300

// useItemsTotal — сколько платьев подходит под фильтры.
// Пока фильтры меняются, отдаёт прошлое число, чтобы кнопка не мигала.
export function useItemsTotal(query: ItemsQuery) {
  // ключ-строка: новый объект фильтров на каждом рендере не должен сбрасывать паузу
  const key = JSON.stringify(query)
  const settledKey = useDebouncedValue(key, DEBOUNCE_MS)
  const settled = useMemo(() => JSON.parse(settledKey) as ItemsQuery, [settledKey])

  const { data, isFetching } = useQuery({
    queryKey: itemKeys.total(settled),
    queryFn: ({ signal }) => fetchItemsTotal(settled, signal),
    placeholderData: keepPreviousData, // прошлое число, пока считается новое
  })
  return { total: data ?? null, pending: isFetching || settledKey !== key }
}
