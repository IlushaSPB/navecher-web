import { act } from '@testing-library/react'
import { useSearchParams } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { localToday } from '@/shared/lib/date'
import { renderRoute } from '@/shared/test'
import { EMPTY_FILTERS, readFilters, toItemsQuery, writeFilters } from './filters'
import { useCatalogFilters } from './useCatalogFilters'

const TODAY = '2026-11-24'

describe('фильтры в адресе: чтение и запись', () => {
  it('читает фильтры из ?date=&size=&priceMax=&color=', () => {
    const params = new URLSearchParams('date=2026-12-12&size=S&priceMax=5000&color=black&utm=tg')
    expect(readFilters(params, TODAY)).toEqual({ date: '2026-12-12', size: 'S', priceMax: 5000, color: 'black' })
  })

  it('отбрасывает мусор и прошедшую дату — иначе сервер ответит 400', () => {
    const params = new URLSearchParams('date=2026-11-23&size=&priceMax=-1&color=')
    expect(readFilters(params, TODAY)).toEqual(EMPTY_FILTERS)
    expect(readFilters(new URLSearchParams('date=2026-02-30&priceMax=1.5'), TODAY)).toEqual(EMPTY_FILTERS)
  })

  it('пишет фильтры, не трогая чужие параметры, и убирает пустые', () => {
    const base = new URLSearchParams('utm=tg&size=M&color=red')
    const next = writeFilters(base, { size: 'S', color: null, priceMax: 3000 })
    expect(next.toString()).toBe('utm=tg&size=S&priceMax=3000')
  })

  it('чтение после записи возвращает те же фильтры', () => {
    const filters = { date: '2026-12-31', size: 'XL', priceMax: 7000, color: 'silver' }
    expect(readFilters(writeFilters(new URLSearchParams(), filters), TODAY)).toEqual(filters)
  })

  it('toItemsQuery — пустые фильтры не уходят в запрос', () => {
    expect(toItemsQuery({ ...EMPTY_FILTERS, size: 'S' })).toEqual({
      date: undefined,
      size: 'S',
      priceMax: undefined,
      color: undefined,
    })
  })
})

// Хук внутри роутера в памяти; setParams рядом — чтобы менять адрес из теста, как это делает экран.
function renderFilters(url: string) {
  const latest: { current?: { catalog: ReturnType<typeof useCatalogFilters>; setParams: (q: string) => void } } = {}
  function Probe() {
    const [, setParams] = useSearchParams()
    latest.current = { catalog: useCatalogFilters(), setParams }
    return null
  }
  renderRoute(<Probe />, { path: '*', url })
  return () => latest.current!
}

describe('useCatalogFilters — адрес как единственный источник', () => {
  it('фильтры из адреса и ссылки, которые их несут', () => {
    const { filters, hrefTo } = renderFilters('/?size=S&color=black&utm=tg')().catalog
    expect(filters).toMatchObject({ size: 'S', color: 'black', date: null })
    expect(hrefTo('/items/7')).toBe('/items/7?size=S&color=black&utm=tg')
    expect(hrefTo('/filters', { size: null })).toBe('/filters?color=black&utm=tg')
  })

  it('смена адреса меняет фильтры', () => {
    const hook = renderFilters('/')
    expect(hook().catalog.filters).toEqual(EMPTY_FILTERS)
    const date = localToday()
    act(() => hook().setParams(`?date=${date}&priceMax=4000`))
    expect(hook().catalog.filters).toEqual({ ...EMPTY_FILTERS, date, priceMax: 4000 })
  })
})
