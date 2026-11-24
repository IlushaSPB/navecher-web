import { useMemo } from 'react'
import { useConfig } from '@/shared/config'
import { SIZES } from '@/shared/lib/sizes'

const PRICE_STEP = 500
const FALLBACK_PRICE_BOUND = 10_000

// useCatalogOptions — из чего выбирать в фильтрах: размеры, цвета, границы цены (из /api/config).
export function useCatalogOptions() {
  const { config } = useConfig()
  return useMemo(() => {
    const bound = config?.priceMaxBound || FALLBACK_PRICE_BOUND
    return {
      sizes: config?.sizesAll?.length ? config.sizesAll : [...SIZES],
      colors: config?.colors ?? [],
      // верх кратен шагу, иначе ползунок не дойдёт до края и «без ограничения» не выбрать
      price: { min: PRICE_STEP, max: Math.ceil(bound / PRICE_STEP) * PRICE_STEP, step: PRICE_STEP },
    }
  }, [config])
}
