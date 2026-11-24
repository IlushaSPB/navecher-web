import type { Item, ItemOwner, Measurements } from '@/shared/api'
import { plural, rating } from '@/shared/lib/format'

type Titled = { title: string; brand: string; categoryLabel?: string }

// itemTitle — название платья: своё, иначе бренд, иначе категория.
export const itemTitle = ({ title, brand, categoryLabel }: Titled) => title || brand || categoryLabel || 'Платье'

const times = (n: number) => `${n} ${plural(n, 'раз', 'раза', 'раз')}`

// itemFacts — строка над названием: «Rasario · размер S · надевали 1 раз · сдавали 2 раза».
export function itemFacts({ brand, size, timesWorn, rentals }: Pick<Item, 'brand' | 'size' | 'timesWorn' | 'rentals'>) {
  return [
    brand,
    size && `размер ${size}`,
    timesWorn > 0 && `надевали ${times(timesWorn)}`,
    rentals > 0 && `сдавали ${times(rentals)}`,
  ]
    .filter(Boolean)
    .join(' · ')
}

// ownerFacts — строка под именем владелицы: «★ 5,0 · 2 аренды · м. Кропоткинская».
export function ownerFacts({ rating: r, rentals }: ItemOwner, metro: string) {
  return [
    r !== null && `★ ${rating(r)}`,
    rentals > 0 && `${rentals} ${plural(rentals, 'аренда', 'аренды', 'аренд')}`,
    metro && `м. ${metro}`,
  ]
    .filter(Boolean)
    .join(' · ')
}

// firstName — «Мария В.» → «Мария».
export const firstName = (displayName: string) => displayName.trim().split(/\s+/)[0] ?? ''

export const MEASUREMENT_LABELS = { bust: 'Грудь', waist: 'Талия', hips: 'Бёдра', length: 'Длина' } as const

export type MeasurementKey = keyof typeof MEASUREMENT_LABELS

// hasMeasureNumbers — есть хоть один замер числом; иначе показываем текст владелицы.
export const hasMeasureNumbers = (m: Measurements) =>
  (Object.keys(MEASUREMENT_LABELS) as MeasurementKey[]).some((k) => m[k] !== null)
