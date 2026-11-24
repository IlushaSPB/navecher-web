import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { server } from '@/shared/api/mocks/node'
import { createQueryWrapper } from '@/shared/test'
import { FEED_PAGE_SIZE, useItemsFeed } from './useItemsFeed'
import { useItem } from './useItem'

describe('useItem — через MSW', () => {
  it('отдаёт платье из моков', async () => {
    const { result } = renderHook(() => useItem(1), { wrapper: createQueryWrapper() })
    expect(result.current.isPending).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toMatchObject({ id: 1, brand: 'Rasario', priceRent: 4500, size: 'S' })
  })

  it('404 — data === null, а не ошибка', async () => {
    const { result } = renderHook(() => useItem(999), { wrapper: createQueryWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeNull()
  })

  it('500 — ошибка с кодом из тела', async () => {
    server.use(
      http.get('/api/items/:id', () => HttpResponse.json({ error: 'boom', code: 'internal' }, { status: 500 })),
    )
    const { result } = renderHook(() => useItem(1), { wrapper: createQueryWrapper() })
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toMatchObject({ status: 500, code: 'internal' })
  })
})

describe('useItemsFeed — страницы ленты', () => {
  it('фильтр по размеру уходит в запрос', async () => {
    const { result } = renderHook(() => useItemsFeed({ size: 'S' }), { wrapper: createQueryWrapper() })
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.items.map((i) => i.size)).toEqual(['S', 'S'])
    expect(result.current).toMatchObject({ total: 2, hasMore: false, error: null })
  })

  it('loadMore догружает следующую страницу без повторов', async () => {
    // лента длиннее страницы: 30 платьев, сдвиг на 1 между запросами даёт один повтор
    const all = Array.from({ length: 30 }, (_, i) => ({ id: i + 1, title: `Платье ${i + 1}` }))
    server.use(
      http.get('/api/items', ({ request }) => {
        const offset = Number(new URL(request.url).searchParams.get('offset'))
        const from = offset === 0 ? 0 : offset - 1
        return HttpResponse.json({ total: all.length, items: all.slice(from, from + FEED_PAGE_SIZE) })
      }),
    )
    const { result } = renderHook(() => useItemsFeed({}), { wrapper: createQueryWrapper() })
    await waitFor(() => expect(result.current.items).toHaveLength(FEED_PAGE_SIZE))
    expect(result.current.hasMore).toBe(true)

    result.current.loadMore()
    await waitFor(() => expect(result.current.items).toHaveLength(30))
    expect(new Set(result.current.items.map((i) => i.id)).size).toBe(30)
    expect(result.current.hasMore).toBe(false)
  })
})
