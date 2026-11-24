import { request, type SiteConfig } from '@/shared/api'

// fetchConfig — настройки сайта: имя бота, счётчик, справочники фильтров, «сегодня» сервера.
export const fetchConfig = (signal?: AbortSignal) => request<SiteConfig>('/api/config', { signal })
