import { useCallback, useEffect, useState } from 'react'
import { useLatest } from './useLatest'

type Snapshot<T> = { key: string | null; data?: T; error?: unknown; done: boolean }

export type RequestState<T> = {
  data: T | undefined
  error: unknown
  loading: boolean
  reload(): void
}

type Options = {
  keepPrevious?: boolean // пока грузится новый ключ, отдавать прошлые данные (счётчик в фильтрах)
}

// useRequest — загрузка по ключу: новый ключ — новый запрос, прошлый отменяется; null — не грузить.
export function useRequest<T>(
  key: string | null,
  fetcher: (signal: AbortSignal) => Promise<T>,
  { keepPrevious = false }: Options = {},
): RequestState<T> {
  const fetchRef = useLatest(fetcher)
  const [nonce, setNonce] = useState(0)
  const [state, setState] = useState<Snapshot<T>>({ key: null, done: false })

  useEffect(() => {
    if (key === null) return
    const ctrl = new AbortController()
    fetchRef.current(ctrl.signal).then(
      (data) => !ctrl.signal.aborted && setState({ key, data, done: true }),
      (error) => !ctrl.signal.aborted && setState({ key, error, done: true }),
    )
    return () => ctrl.abort()
  }, [key, nonce, fetchRef])

  const reload = useCallback(() => {
    setState((s) => ({ ...s, error: undefined, done: false }))
    setNonce((n) => n + 1)
  }, [])

  const current = state.key === key
  return {
    data: current || keepPrevious ? state.data : undefined,
    error: current ? state.error : undefined,
    loading: key !== null && !(current && state.done),
    reload,
  }
}
