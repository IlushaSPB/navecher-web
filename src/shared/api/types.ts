// Типы ответов API (navecher-api).

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
  devAuth: boolean
  colors: ColorOption[]
  sizesAll: string[]
  priceMaxBound: number
  today: string // YYYY-MM-DD по времени сервиса
}

export type User = {
  id: number
  tgId: number
  username: string
  firstName: string
  lastName: string
  photoUrl: string
  approved: boolean
}

export type Session = { token: string; user: User }

// Пользователь из Telegram Login Widget — отправляется на сервер как есть, сервер проверяет hash.
export type TelegramWidgetUser = {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

// Каталог

export type ColorOption = { id: string; label: string; hex: string }

// ItemPreview — платье в ленте. photo — адрес обложки, пусто — фото нет.
export type ItemPreview = {
  id: number
  title: string
  brand: string
  size: string
  color: string
  priceRent: number
  photo: string
  photosCount: number
  demo: boolean
}

export type ItemsPage = { total: number; items: ItemPreview[] }

// ItemsQuery — фильтры ленты; пустые не отправляются. date — YYYY-MM-DD, не раньше сегодня.
export type ItemsQuery = {
  date?: string
  size?: string
  priceMax?: number
  color?: string
  limit?: number
  offset?: number
}

export type ItemCondition = '' | 'new_tag' | 'worn_few' | 'has_flaws'

// Measurements — замеры в сантиметрах; если чисел нет, text — как написала владелица.
export type Measurements = {
  bust: number | null
  waist: number | null
  hips: number | null
  length: number | null
  text: string
}

export type ItemOwner = { displayName: string; rating: number | null; rentals: number }

// Item — карточка платья целиком.
export type Item = {
  id: number
  title: string
  brand: string
  category: string
  categoryLabel: string
  size: string
  color: string
  condition: ItemCondition
  timesWorn: number
  rentals: number
  priceRent: number
  priceRetail: number
  deposit: number
  measurements: Measurements
  notes: string
  metro: string
  photos: string[]
  demo: boolean
  owner: ItemOwner
}

// Availability — занятые вечера платья за месяц.
export type Availability = { month: string; today: string; busy: string[] }
