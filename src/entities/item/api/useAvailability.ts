import { useMemo } from 'react'
import { fetchAvailability } from '@/shared/api'
import type { IsoMonth } from '@/shared/lib/date'
import { useRequest } from '@/shared/lib/useRequest'

// useAvailability — занятые вечера платья за месяц; month === null — не грузить.
export function useAvailability(id: number, month: IsoMonth | null) {
  const { data, loading, error, reload } = useRequest(month === null ? null : `availability:${id}:${month}`, (signal) =>
    fetchAvailability(id, month as IsoMonth, signal),
  )
  const busy = useMemo(() => new Set(data?.busy ?? []), [data])
  return { busy, today: data?.today, loaded: !!data, loading, error, reload }
}
