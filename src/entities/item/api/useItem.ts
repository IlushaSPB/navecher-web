import { fetchItem } from '@/shared/api'
import { useRequest } from '@/shared/lib/useRequest'

// useItem — платье по id; data === null — платья нет (404).
export function useItem(id: number | null) {
  return useRequest(id === null ? null : `item:${id}`, (signal) => fetchItem(id as number, signal))
}
