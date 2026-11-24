import { useParams } from 'react-router-dom'

// useItemId — id платья из адреса /items/:id; null — в адресе не число.
export function useItemId(): number | null {
  const n = Number(useParams().id)
  return Number.isInteger(n) && n > 0 ? n : null
}
