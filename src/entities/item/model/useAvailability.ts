import { skipToken, useQuery } from '@tanstack/react-query'
import type { Availability } from '@/shared/api'
import type { IsoDate, IsoMonth } from '@/shared/lib/date'
import { fetchAvailability } from '../api/api'
import { itemKeys } from '../api/keys'

const NONE: ReadonlySet<IsoDate> = new Set()

// select вне компонента: React Query пересчитывает его, только когда пришли новые данные
const toBusy = ({ busy, today }: Availability) => ({ busy: new Set<IsoDate>(busy) as ReadonlySet<IsoDate>, today })

// useAvailability — занятые вечера платья за месяц; month === null — не грузить.
export function useAvailability(id: number, month: IsoMonth | null) {
  const { data, error, refetch } = useQuery({
    queryKey: itemKeys.availability(id, month),
    queryFn: month === null ? skipToken : ({ signal }) => fetchAvailability(id, month, signal),
    select: toBusy,
  })
  return {
    busy: data?.busy ?? NONE,
    today: data?.today,
    loaded: data !== undefined,
    error,
    reload: () => void refetch(),
  }
}
