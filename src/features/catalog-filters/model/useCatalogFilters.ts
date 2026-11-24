import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useToday } from '@/shared/config'
import { readFilters, writeFilters, type CatalogFilters } from './filters'

// useCatalogFilters — единственный источник фильтров: читает их из адреса и строит ссылки, которые их несут.
// hrefTo('/items/7') — тот же набор фильтров; hrefTo('/items/7', { date }) — с заменой.
export function useCatalogFilters() {
  const [params] = useSearchParams()
  const today = useToday()
  const filters = useMemo(() => readFilters(params, today), [params, today])

  const hrefTo = useCallback(
    (pathname: string, patch: Partial<CatalogFilters> = {}) => {
      const q = writeFilters(params, { ...filters, ...patch }).toString()
      return q ? `${pathname}?${q}` : pathname
    },
    [params, filters],
  )

  return { filters, hrefTo, today }
}
