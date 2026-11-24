import { useCallback, useState } from 'react'
import { EMPTY_FILTERS, type CatalogFilters } from './filters'

// useFilterDraft — черновик фильтров на экране «Фильтры»: в адрес попадает только по кнопке.
export function useFilterDraft(initial: CatalogFilters) {
  const [draft, setDraft] = useState(initial)

  const set = useCallback(<K extends keyof CatalogFilters>(key: K, value: CatalogFilters[K]) => {
    setDraft((d) => ({ ...d, [key]: value }))
  }, [])

  // toggle — повторное касание выбранного значения снимает его
  const toggle = useCallback(<K extends keyof CatalogFilters>(key: K, value: CatalogFilters[K]) => {
    setDraft((d) => ({ ...d, [key]: d[key] === value ? null : value }))
  }, [])

  const reset = useCallback(() => setDraft(EMPTY_FILTERS), [])

  return { draft, set, toggle, reset }
}
