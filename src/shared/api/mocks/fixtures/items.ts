import type { ColorOption, Item, ItemPreview, Measurements } from '../../types'
import { placeholderPhoto } from './photo'

// Демо-каталог для моков: восемь платьев, как на витрине. Тексты — как их пишут владелицы.

export const COLORS: ColorOption[] = [
  { id: 'black', label: 'Чёрный', hex: '#141012' },
  { id: 'white', label: 'Белый', hex: '#FFFFFF' },
  { id: 'berry', label: 'Ягодный', hex: '#8C2E52' },
  { id: 'pink', label: 'Розовый', hex: '#EBC3D0' },
  { id: 'blue', label: 'Синий', hex: '#2B3A67' },
  { id: 'green', label: 'Изумрудный', hex: '#234537' },
  { id: 'beige', label: 'Бежевый', hex: '#C9A87C' },
  { id: 'silver', label: 'Серебристый', hex: '#C4C2C6' },
]

export const CATEGORIES = { dress: 'Платье' } as const

type Seed = Pick<Item, 'id' | 'title' | 'brand' | 'size' | 'color' | 'priceRent' | 'priceRetail' | 'metro'> & {
  category: keyof typeof CATEGORIES
  worn: number
  rentals: number
  condition: Item['condition']
  depositPct: 30 | 50 | 70 // залог — доля цены в магазине, её выбирает владелица
  measure: [bust: number, waist: number, hips: number, length: number] | string
  owner: [displayName: string, rating: number | null, rentals: number]
  photos: number
  notes?: string
}

const hexOf = (color: string) => COLORS.find((c) => c.id === color)?.hex ?? '#888888'

function measurements(m: Seed['measure']): Measurements {
  if (typeof m === 'string') return { bust: null, waist: null, hips: null, length: null, text: m }
  const [bust, waist, hips, length] = m
  return { bust, waist, hips, length, text: '' }
}

const dress = (s: Seed): Item => ({
  id: s.id,
  title: s.title,
  brand: s.brand,
  category: s.category,
  categoryLabel: CATEGORIES[s.category],
  size: s.size,
  color: s.color,
  condition: s.condition,
  timesWorn: s.worn,
  rentals: s.rentals,
  priceRent: s.priceRent,
  priceRetail: s.priceRetail,
  deposit: Math.round((s.priceRetail * s.depositPct) / 100),
  measurements: measurements(s.measure),
  notes: s.notes ?? '',
  metro: s.metro,
  photos: Array.from({ length: s.photos }, (_, i) => placeholderPhoto(hexOf(s.color), i)),
  demo: false,
  owner: { displayName: s.owner[0], rating: s.owner[1], rentals: s.owner[2] },
})

// prettier-ignore
export const ITEMS: Item[] = [
  dress({ id: 1, title: 'Платье-бюстье из атласа', brand: 'Rasario', size: 'S', color: 'black', priceRent: 4500,
    priceRetail: 42_000, metro: 'Кропоткинская', category: 'dress', worn: 1, rentals: 2, condition: 'worn_few',
    depositPct: 50, measure: [84, 64, 90, 120], owner: ['Мария В.', 5, 2], photos: 4 }),
  dress({ id: 2, title: 'Кружевное платье миди', brand: 'Self-Portrait', size: 'M', color: 'beige', priceRent: 3900,
    priceRetail: 38_000, metro: 'Чистые пруды', category: 'dress', worn: 2, rentals: 1, condition: 'worn_few',
    depositPct: 30, measure: [88, 68, 94, 105], owner: ['Анна К.', 4.8, 5], photos: 3 }),
  dress({ id: 3, title: 'Шёлковое платье-комбинация', brand: '12 STOREEZ', size: 'XS', color: 'green', priceRent: 2500,
    priceRetail: 18_000, metro: 'Белорусская', category: 'dress', worn: 0, rentals: 0, condition: 'new_tag',
    depositPct: 70, measure: [80, 60, 86, 115], owner: ['Ольга С.', null, 0], photos: 3 }),
  dress({ id: 4, title: 'Платье с открытой спиной', brand: 'Alexander Terekhov', size: 'L', color: 'berry', priceRent: 6000,
    priceRetail: 65_000, metro: 'Парк культуры', category: 'dress', worn: 1, rentals: 3, condition: 'worn_few',
    depositPct: 50, measure: [92, 74, 100, 140], owner: ['Екатерина Л.', 4.9, 7], photos: 5 }),
  dress({ id: 5, title: 'Бархатное платье в пол', brand: 'Ulyana Sergeenko', size: 'M', color: 'berry', priceRent: 8500,
    priceRetail: 120_000, metro: 'Патриаршие', category: 'dress', worn: 1, rentals: 1, condition: 'worn_few',
    depositPct: 70, measure: [88, 68, 94, 150], owner: ['Дарья М.', 5, 1], photos: 4,
    notes: 'Тяжёлый бархат, под него лучше каблук от 7 см.' }),
  dress({ id: 6, title: 'Платье с драпировкой на плече', brand: 'Vika Smolyanitskaya', size: 'S', color: 'blue', priceRent: 3500,
    priceRetail: 32_000, metro: 'Сокол', category: 'dress', worn: 3, rentals: 4, condition: 'worn_few',
    depositPct: 30, measure: [84, 64, 90, 100], owner: ['Алина Р.', 4.7, 9], photos: 2 }),
  dress({ id: 7, title: 'Платье в пайетках', brand: 'Laroom', size: 'XL', color: 'silver', priceRent: 3000,
    priceRetail: 24_000, metro: 'Тульская', category: 'dress', worn: 2, rentals: 0, condition: 'has_flaws',
    depositPct: 50, measure: 'Сядет на 48–50, длина чуть ниже колена. Пара пайеток у шва — на фото.',
    owner: ['Ирина Б.', null, 0], photos: 3 }),
  dress({ id: 8, title: 'Коктейльное платье с баской', brand: 'Masterpeace', size: 'L', color: 'pink', priceRent: 2800,
    priceRetail: 21_000, metro: 'Динамо', category: 'dress', worn: 1, rentals: 2, condition: 'worn_few',
    depositPct: 30, measure: [94, 76, 102, 98], owner: ['Светлана Т.', 4.6, 3], photos: 3 }),
]

// toPreview — платье в ленте: обложка и число фото вместо всей галереи.
export const toPreview = (item: Item): ItemPreview => ({
  id: item.id,
  title: item.title,
  brand: item.brand,
  size: item.size,
  color: item.color,
  priceRent: item.priceRent,
  photo: item.photos[0] ?? '',
  photosCount: item.photos.length,
  demo: item.demo,
})
