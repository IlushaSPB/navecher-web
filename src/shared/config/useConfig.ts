import { useQuery } from '@tanstack/react-query'
import { localToday, type IsoDate } from '@/shared/lib/date'
import { fetchConfig } from './api'
import { configKeys } from './keys'

// Настройки меняются только с выкладкой сервера — перезапрашивать их чаще нет смысла.
const CONFIG_STALE_MS = 10 * 60_000

// useConfig — настройки сайта из /api/config; config === null, пока не пришли или не загрузились (failed).
export function useConfig() {
  const { data, isError } = useQuery({
    queryKey: configKeys.all,
    queryFn: ({ signal }) => fetchConfig(signal),
    staleTime: CONFIG_STALE_MS,
  })
  return { config: data ?? null, failed: isError }
}

// useToday — сегодня по времени сервиса; пока настройки не пришли — по часам устройства.
export const useToday = (): IsoDate => useConfig().config?.today || localToday()
