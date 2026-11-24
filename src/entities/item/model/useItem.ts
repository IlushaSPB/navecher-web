import { useQuery } from '@tanstack/react-query'
import { fetchItem } from '../api/api'
import { itemKeys } from '../api/keys'

// useItem — платье по id; data === null — платья нет (404).
export function useItem(id: number) {
  return useQuery({
    queryKey: itemKeys.detail(id),
    queryFn: ({ signal }) => fetchItem(id, signal),
  })
}
