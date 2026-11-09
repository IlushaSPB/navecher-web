export type Category = { id: string; label: string; count: number }
export type Size = { id: string; count: number }

export type SiteConfig = {
  brand: string
  city: string
  botUsername: string
  channelUrl: string
  categories: Category[]
  sizes: Size[]
  total: number
  minRent: number
  metrikaId: string
  demo: boolean
}

export type Item = {
  id: number
  category: string
  categoryLabel: string
  brand: string
  size: string
  measurements: string
  notes: string
  priceRetail: number
  priceRent: number
  deposit: number
  metro: string
  rentals: number
  photos: string[]
  rentUrl: string // пусто — арендовать нельзя: демо-вещь или бот не подключён
  reportUrl: string
  demo: boolean
  createdAt: string
}

export type ItemsPage = { total: number; items: Item[] }

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url}: ${res.status}`)
  return res.json() as Promise<T>
}

export const fetchConfig = () => getJSON<SiteConfig>('/api/config')

export function fetchItems(category: string, offset: number, limit = 12, size = '') {
  const q = new URLSearchParams({ limit: String(limit), offset: String(offset) })
  if (category) q.set('category', category)
  if (size) q.set('size', size)
  return getJSON<ItemsPage>(`/api/items?${q}`)
}

// fetchItem — одна активная вещь; null, если её сняли.
export async function fetchItem(id: number): Promise<Item | null> {
  const res = await fetch(`/api/items/${id}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`item ${id}: ${res.status}`)
  return res.json() as Promise<Item>
}

// fetchByIds — сохранённые вещи. Снятые с публикации (404) возвращаются в gone.
export async function fetchByIds(ids: number[]): Promise<{ items: Item[]; gone: number[] }> {
  const results = await Promise.all(
    ids.slice(0, 60).map(async (id) => {
      const res = await fetch(`/api/items/${id}`)
      if (res.status === 404) return { id, item: null }
      if (!res.ok) throw new Error(`item ${id}: ${res.status}`)
      return { id, item: (await res.json()) as Item }
    }),
  )
  return {
    items: results.flatMap((r) => (r.item ? [r.item] : [])),
    gone: results.flatMap((r) => (r.item ? [] : [r.id])),
  }
}

// isNew — вещь выставлена меньше двух суток назад.
export const isNew = (it: Item) => Date.now() - new Date(it.createdAt).getTime() < 48 * 3600 * 1000

// titleOf — название вещи: бренд или описание, иначе категория.
export const titleOf = (it: Pick<Item, 'brand' | 'categoryLabel'>) => it.brand || it.categoryLabel

// botLink — deep-ссылка в бота (lend_web, src_web…); null, если бот не подключён.
export function botLink(cfg: SiteConfig | null, payload: string): string | null {
  if (!cfg?.botUsername) return null
  return `https://t.me/${cfg.botUsername}?start=${payload}`
}

export const num = new Intl.NumberFormat('ru-RU')
export const rub = (n: number) => `${num.format(n)} ₽`
export const round100 = (n: number) => Math.round(n / 100) * 100

// Подсказки цены — те же, что даёт бот: аренда 10/15/20%, залог 50/70% цены в магазине
// (примерно столько стоит перепродать вещь — меньший залог делает «не вернуть» выгодным).
export const RENT_RATES = [10, 15, 20]
export const DEPOSIT_RATES = [50, 70]
export const SIZES = ['XS', 'S', 'M', 'L', 'XL']

// plural — «1 раз», «2 раза», «5 раз».
export function plural(n: number, one: string, few: string, many: string) {
  const n10 = n % 10
  const n100 = n % 100
  if (n10 === 1 && n100 !== 11) return one
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return few
  return many
}

// nb — неразрывный пробел после коротких предлогов и союзов: «платье с разрезом»
// не разорвётся на «платье с / разрезом». Для текстов из данных (названия вещей).
export const nb = (s: string) => s.replace(/(^|[\s(«])(в|во|и|с|со|к|о|об|у|а|из|за|на|по|до|от|не|без)\s/gi, '$1$2 ')
