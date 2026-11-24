import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchItems, type ItemPreview, type ItemsQuery } from '@/shared/api'

export const FEED_PAGE_SIZE = 24

type FeedState = {
  key: string
  items: ItemPreview[]
  total: number | null
  loading: boolean
  error: unknown
}

const initial = (key: string): FeedState => ({ key, items: [], total: null, loading: true, error: undefined })

// Последняя загруженная лента: возврат с карточки платья показывает её сразу, без мигания
// и с прежней прокруткой. Живёт несколько минут, потом лента грузится заново.
const SNAPSHOT_TTL_MS = 5 * 60_000
let snapshot: { state: FeedState; at: number } | null = null

const fromSnapshot = (key: string) =>
  snapshot && snapshot.state.key === key && Date.now() - snapshot.at < SNAPSHOT_TTL_MS ? snapshot.state : null

// склейка страниц без повторов: между запросами лента могла сдвинуться
function append(prev: ItemPreview[], next: ItemPreview[]) {
  const seen = new Set(prev.map((i) => i.id))
  return prev.concat(next.filter((i) => !seen.has(i.id)))
}

// useItemsFeed — лента по страницам: новые фильтры — с начала, loadMore — следующая страница.
export function useItemsFeed(query: ItemsQuery) {
  const key = JSON.stringify(query)
  const [state, setState] = useState<FeedState>(() => fromSnapshot(key) ?? initial(key))
  const ctrlRef = useRef<AbortController | null>(null)

  const load = useCallback((key: string, offset: number) => {
    ctrlRef.current?.abort()
    const ctrl = new AbortController()
    ctrlRef.current = ctrl
    setState((s) => (s.key === key && offset > 0 ? { ...s, loading: true, error: undefined } : initial(key)))
    fetchItems({ ...(JSON.parse(key) as ItemsQuery), limit: FEED_PAGE_SIZE, offset }, ctrl.signal).then(
      (page) =>
        !ctrl.signal.aborted &&
        setState((s) => ({
          key,
          items: offset > 0 ? append(s.items, page.items) : page.items,
          total: page.total,
          loading: false,
          error: undefined,
        })),
      (error) => !ctrl.signal.aborted && setState((s) => ({ ...s, loading: false, error })),
    )
  }, [])

  useEffect(() => {
    const saved = fromSnapshot(key)
    if (saved) setState(saved)
    else load(key, 0)
    return () => ctrlRef.current?.abort()
  }, [key, load])

  useEffect(() => {
    if (!state.loading && !state.error && state.total !== null) snapshot = { state, at: Date.now() }
  }, [state])

  const current = state.key === key ? state : initial(key)
  const { items, total } = current

  return {
    items,
    total,
    loading: current.loading,
    error: current.error,
    hasMore: total !== null && items.length < total,
    loadMore: () => load(key, items.length),
    retry: () => load(key, items.length),
  }
}

export type ItemsFeed = ReturnType<typeof useItemsFeed>
