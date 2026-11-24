import { useQuery } from '@tanstack/react-query'
import { isApiError, tokenStore, type User } from '@/shared/api'
import { fetchMe } from '../api/api'
import { sessionKeys } from '../api/keys'

// restoreSession — кто вошёл: по сохранённому токену или cookie; null — никто. 401 — токен протух, забываем его.
export async function restoreSession(signal?: AbortSignal): Promise<User | null> {
  try {
    return await fetchMe(signal)
  } catch (e) {
    if (isApiError(e, 'unauthorized')) {
      tokenStore.clear()
      return null
    }
    throw e
  }
}

// useMe — текущий пользователь из кэша ['me']. enabled: false — сервер не спрашиваем (мини-апп входит сам).
export function useMe({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: sessionKeys.me,
    queryFn: ({ signal }) => restoreSession(signal),
    enabled,
  })
}
