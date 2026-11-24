import type { Item } from '@/shared/api'
import { rub } from '@/shared/lib/format'
import { Photo } from '@/shared/ui'
import { itemTitle } from '../lib/item'
import s from './ItemSummary.module.css'

// ItemSummary — платье одной строкой: миниатюра 60×80, бренд и размер, название, цена и владелица.
export function ItemSummary({ item }: { item: Item }) {
  const title = itemTitle(item)
  return (
    <div className={s.row}>
      <Photo className={s.thumb} src={item.photos[0] ?? ''} alt="" eager />
      <div className={s.text}>
        <div className={s.facts}>{[item.brand, item.size].filter(Boolean).join(' · ')}</div>
        <div className={s.title}>{title}</div>
        <div className={s.meta}>
          {rub(item.priceRent)} за вечер{item.owner.displayName && ` · ${item.owner.displayName}`}
        </div>
      </div>
    </div>
  )
}
