// Типы ответов API. Источник правды — navecher-api/api/openapi.yaml:
// schema.gen.ts генерирует `npm run api:types` (руками не править), здесь — короткие имена для кода.
import type { components } from './schema.gen'

type S = components['schemas']

export type Category = S['Category']
export type Size = S['SizeCount']
export type ColorOption = S['Color']
export type SiteConfig = S['Config']

export type User = S['User']
export type Session = S['Login']
// Пользователь из Telegram Login Widget — отправляется на сервер как есть, сервер проверяет hash.
export type TelegramWidgetUser = S['WidgetUser']

// ItemPreview — платье в ленте. photo — адрес обложки, пусто — фото нет.
export type ItemPreview = S['ItemCard']
export type ItemsPage = S['ItemsPage']
export type ItemColor = S['ItemColor']
export type ItemCondition = S['ItemDetail']['condition']
// Measurements — замеры в сантиметрах; если чисел нет, text — как написала владелица.
export type Measurements = S['Measurements']
export type ItemOwner = S['Owner']
// Item — карточка платья целиком.
export type Item = S['ItemDetail']
// Availability — занятые вечера платья за месяц.
export type Availability = S['Availability']

// ItemsQuery — фильтры ленты; пустые не отправляются. date — YYYY-MM-DD, не раньше сегодня.
export type ItemsQuery = {
  date?: string
  size?: string
  priceMax?: number
  color?: string
  limit?: number
  offset?: number
}
