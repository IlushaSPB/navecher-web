// Размерная сетка платьев — общая для фильтров и размещения.
export const SIZES = ['XS', 'S', 'M', 'L', 'XL'] as const

export type DressSize = (typeof SIZES)[number]
