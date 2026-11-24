import { ItemCard, ItemCardSkeleton, type ItemsFeed } from '@/entities/item'
import { FavoriteButton } from '@/features/favorites'
import { plural } from '@/shared/lib/format'
import { Button, Note, Section, TextButton, TextLink } from '@/shared/ui'
import s from './FeedResults.module.css'

const SKELETON_COUNT = 6

type FeedResultsProps = {
  feed: ItemsFeed
  hasDate: boolean
  hrefTo(pathname: string): string
}

// FeedResults — сетка ленты со всеми состояниями: загрузка, ошибка, пусто, «Показать ещё».
export function FeedResults({ feed, hasDate, hrefTo }: FeedResultsProps) {
  const { items, total, loading, error, hasMore, loadMore, retry } = feed

  if (!items.length) {
    if (error) return <LoadError onRetry={retry} />
    if (loading) return <FeedSkeleton />
    return <FeedEmpty hasDate={hasDate} filtersHref={hrefTo('/filters')} />
  }

  return (
    <>
      <p className="visually-hidden" aria-live="polite">
        {total !== null && `Найдено ${total} ${plural(total, 'платье', 'платья', 'платьев')}`}
      </p>
      <ul className={s.grid}>
        {items.map((item) => (
          <li key={item.id}>
            <ItemCard
              item={item}
              to={hrefTo(`/items/${item.id}`)}
              action={<FavoriteButton id={item.id} iconSize={18} />}
            />
          </li>
        ))}
      </ul>
      {error ? (
        <LoadError onRetry={retry} />
      ) : (
        hasMore && (
          <div className={s.more}>
            <Button variant="secondary" onClick={loadMore} disabled={loading}>
              {loading ? 'Загружаем…' : 'Показать ещё'}
            </Button>
          </div>
        )
      )}
    </>
  )
}

function FeedSkeleton() {
  return (
    <div className={s.grid} aria-busy="true" aria-label="Загружаем платья">
      {Array.from({ length: SKELETON_COUNT }, (_, i) => (
        <ItemCardSkeleton key={i} />
      ))}
    </div>
  )
}

function FeedEmpty({ hasDate, filtersHref }: { hasDate: boolean; filtersHref: string }) {
  return (
    <Section className={s.empty}>
      <p className={s.emptyTitle}>{hasDate ? 'На эту дату ничего не нашлось' : 'Ничего не нашлось'}</p>
      <TextLink to={filtersHref}>Изменить фильтры</TextLink>
    </Section>
  )
}

function LoadError({ onRetry }: { onRetry(): void }) {
  return (
    <Section>
      <Note>Не получилось загрузить платья. Проверьте связь и попробуйте ещё раз.</Note>
      <TextButton onClick={onRetry}>Повторить</TextButton>
    </Section>
  )
}
