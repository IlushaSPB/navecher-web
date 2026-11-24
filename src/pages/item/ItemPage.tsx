import { itemFacts, itemTitle } from '@/entities/item'
import { useCatalogFilters } from '@/features/catalog-filters'
import { FavoriteButton } from '@/features/favorites'
import type { Item } from '@/shared/api'
import { rub } from '@/shared/lib/format'
import { Eyebrow, Gallery, HeaderBack, Screen, Skeleton, TextAnchor, TextLink, Title } from '@/shared/ui'
import { ItemBooking } from './ItemBooking'
import { ItemGate } from './ItemGate'
import { ItemMeasurements } from './ItemMeasurements'
import { ItemOwner } from './ItemOwner'
import s from './ItemPage.module.css'

export function ItemPage() {
  return (
    <ItemGate title="Платье" skeleton={<ItemPageSkeleton />}>
      {(item) => <ItemDetails item={item} />}
    </ItemGate>
  )
}

function ItemDetails({ item }: { item: Item }) {
  const { hrefTo } = useCatalogFilters()
  const title = itemTitle(item)
  return (
    <Screen>
      <div className={s.hero}>
        <Gallery className={s.gallery} photos={item.photos} alt={title} />
        <div className={s.back}>
          <HeaderBack label="Назад в ленту" fallback={hrefTo('/')} />
        </div>
        <FavoriteButton id={item.id} className={s.favorite} />
      </div>

      <header className={s.intro}>
        <Eyebrow tone="muted">{itemFacts(item)}</Eyebrow>
        <Title className={s.title}>{title}</Title>
        <div className={s.prices}>
          <div>
            <span className={s.price}>{rub(item.priceRent)}</span> <span className={s.muted}>за вечер</span>
          </div>
          {item.deposit > 0 && <div>Залог {rub(item.deposit)}</div>}
        </div>
      </header>

      <ItemMeasurements measurements={item.measurements} />
      <ItemOwner owner={item.owner} metro={item.metro} />
      <ItemBooking item={item} />

      <footer className={s.links}>
        <TextLink to="/rules">Правила аренды</TextLink>
        <TextAnchor href="#" tone="muted">
          Сообщить о проблеме
        </TextAnchor>
      </footer>
    </Screen>
  )
}

function ItemPageSkeleton() {
  return (
    <Screen>
      <div className={s.hero}>
        <Skeleton className={s.gallery} />
        <div className={s.back}>
          <HeaderBack label="Назад в ленту" />
        </div>
      </div>
      <div className={s.intro} aria-busy="true" aria-label="Загружаем платье">
        <Skeleton className={s.lineShort} />
        <Skeleton className={s.lineTitle} />
        <Skeleton className={s.lineShort} />
      </div>
    </Screen>
  )
}
