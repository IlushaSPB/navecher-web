import { QueryClient, type DefaultOptions } from '@tanstack/react-query'
import { isApiError } from './errors'

const STALE_MS = 30_000
const MAX_RETRIES = 1

// shouldRetry — 4xx не повторяем (ответ не изменится); сеть и 5xx — одна повторная попытка.
export const shouldRetry = (failureCount: number, error: unknown) =>
  !(isApiError(error) && error.status < 500) && failureCount < MAX_RETRIES

// createQueryClient — кэш запросов. Фокус окна не перезапрашивает: в Mini App он «мигает» при каждом сворачивании.
export function createQueryClient(queries: DefaultOptions['queries'] = {}) {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: STALE_MS, retry: shouldRetry, refetchOnWindowFocus: false, ...queries },
    },
  })
}
