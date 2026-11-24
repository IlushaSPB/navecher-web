import { useNavigate } from 'react-router-dom'
import { useItemsFeed } from '@/entities/item'
import { toItemsQuery, useCatalogFilters } from '@/features/catalog-filters'
import { IconButton, Screen, SearchIcon, ShowcaseHeader } from '@/shared/ui'
import { FeedFilterBar } from './FeedFilterBar'
import { FeedFooter } from './FeedFooter'
import { FeedResults } from './FeedResults'

export function FeedPage() {
  const navigate = useNavigate()
  const { filters, hrefTo } = useCatalogFilters()
  const feed = useItemsFeed(toItemsQuery(filters))
  return (
    <Screen>
      <ShowcaseHeader
        end={
          // поиска пока нет — ведём в фильтры
          <IconButton label="Поиск" onClick={() => navigate(hrefTo('/filters'))}>
            <SearchIcon />
          </IconButton>
        }
      />
      <FeedFilterBar />
      <h1 className="visually-hidden">Лента платьев</h1>
      <FeedResults feed={feed} hasDate={filters.date !== null} hrefTo={hrefTo} />
      <FeedFooter />
    </Screen>
  )
}
