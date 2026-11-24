import { Link } from 'react-router-dom'
import { useCatalogFilters } from '@/features/catalog-filters'
import { capitalize, dateShort } from '@/shared/lib/format'
import { CalendarIcon, FiltersIcon } from '@/shared/ui'
import s from './FeedFilterBar.module.css'

// FeedFilterBar — две ячейки под шапкой ленты: дата вечера и размер с фильтрами; обе ведут в фильтры.
export function FeedFilterBar() {
  const { filters, hrefTo } = useCatalogFilters()
  const to = hrefTo('/filters')
  return (
    <div className={s.bar}>
      <Link to={to} className={s.cell}>
        <CalendarIcon />
        <span className={s.label}>{filters.date ? capitalize(dateShort(filters.date)) : 'Когда вечер?'}</span>
      </Link>
      <Link to={to} className={s.cell}>
        <span className={s.label}>{filters.size ? `Размер ${filters.size} · фильтры` : 'Размер и фильтры'}</span>
        <FiltersIcon />
      </Link>
    </div>
  )
}
