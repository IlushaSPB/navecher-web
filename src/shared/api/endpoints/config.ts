import { request } from '../http'
import type { SiteConfig } from '../types'

export const fetchConfig = (signal?: AbortSignal) => request<SiteConfig>('/api/config', { signal })
