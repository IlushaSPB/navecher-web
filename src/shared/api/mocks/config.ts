import { http, HttpResponse } from 'msw'
import { localToday } from '@/shared/lib/date'
import { SIZES } from '@/shared/lib/sizes'
import type { SiteConfig } from '../types'
import { CATEGORIES, COLORS, ITEMS } from './fixtures/items'

const count = (match: (item: (typeof ITEMS)[number]) => boolean) => ITEMS.filter(match).length

// mockConfig — /api/config как у сервера с DEV_AUTH: вход для разработки виден на /login.
// botUsername пустой: виджет Telegram на localhost всё равно не войдёт.
export const mockConfig = (): SiteConfig => ({
  brand: 'NAVECHER',
  city: 'Москва',
  botUsername: '',
  channelUrl: '',
  categories: (Object.keys(CATEGORIES) as (keyof typeof CATEGORIES)[]).map((id) => ({
    id,
    label: CATEGORIES[id],
    count: count((i) => i.category === id),
  })),
  sizes: SIZES.map((id) => ({ id, count: count((i) => i.size === id) })),
  total: ITEMS.length,
  minRent: Math.min(...ITEMS.map((i) => i.priceRent)),
  metrikaId: '',
  demo: false,
  devAuth: true,
  colors: COLORS,
  sizesAll: [...SIZES],
  priceMaxBound: 10_000,
  today: localToday(),
})

export const configHandlers = [http.get('/api/config', () => HttpResponse.json(mockConfig()))]
