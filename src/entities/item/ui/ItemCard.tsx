import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { ItemPreview } from '@/shared/api'
import { rub } from '@/shared/lib/format'
import { Photo, PhotoStrokes, Skeleton } from '@/shared/ui'
import { itemTitle } from '../lib/item'
import s from './ItemCard.module.css'

type ItemCardProps = {
  item: ItemPreview
  to: string
  action?: ReactNode // справа от бренда: сердце избранного
}

// ItemCard — платье в сетке ленты: фото 3:4, бренд, название, цена за вечер и размер.
export function ItemCard({ item, to, action }: ItemCardProps) {
  const title = itemTitle(item)
  return (
    <article className={s.card}>
      <Link to={to} className={s.photoLink} aria-label={[item.brand, title].filter(Boolean).join(', ')}>
        <Photo className={s.photo} src={item.photo} alt="" />
        <PhotoStrokes className={s.strokes} count={item.photosCount} active={0} tone="light" />
      </Link>
      <div className={s.body}>
        <div className={s.top}>
          <div className={s.brand}>{item.brand}</div>
          {action && <div className={s.action}>{action}</div>}
        </div>
        <div className={s.title}>{title}</div>
        <div className={s.price}>
          {rub(item.priceRent)} <span className={s.muted}>/ вечер{item.size && ` · ${item.size}`}</span>
        </div>
      </div>
    </article>
  )
}

// ItemCardSkeleton — заготовка карточки, пока лента грузится.
export function ItemCardSkeleton() {
  return (
    <div className={s.card} aria-hidden="true">
      <Skeleton className={s.photo} />
      <div className={s.body}>
        <Skeleton className={s.lineShort} />
        <Skeleton className={s.lineLong} />
        <Skeleton className={s.lineMid} />
      </div>
    </div>
  )
}
