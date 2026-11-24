import type { ReactNode } from 'react'
import { firstName, useAvailability } from '@/entities/item'
import { useCatalogFilters } from '@/features/catalog-filters'
import type { Item } from '@/shared/api'
import { monthOf } from '@/shared/lib/date'
import { dateShort, dayMonth } from '@/shared/lib/format'
import { Button, ButtonLink, Note, TextLink } from '@/shared/ui'
import s from './ItemBooking.module.css'

// ItemBooking — дата вечера из адреса и запрос владелице на неё.
export function ItemBooking({ item }: { item: Item }) {
  const { filters, hrefTo } = useCatalogFilters()
  const { date } = filters
  const { busy } = useAvailability(item.id, date ? monthOf(date) : null)
  const calendarHref = hrefTo(`/items/${item.id}/calendar`)
  const requestLabel = date ? `Запросить на ${dayMonth(date)}` : 'Выберите дату'

  let note: ReactNode = `${firstName(item.owner.displayName) || 'Владелица'} ответит в диалоге. Платите только при встрече, после примерки.`
  let canRequest = date !== null
  if (item.demo) {
    note = 'Демо-платье — пример для показа'
    canRequest = false
  } else if (date && busy.has(date)) {
    note = (
      <>
        {dayMonth(date)} платье уже занято.{' '}
        <TextLink to={calendarHref} className={s.inlineLink}>
          Свободные даты
        </TextLink>
      </>
    )
    canRequest = false
  }

  return (
    <>
      <div className={s.dateRow}>
        <div className={s.date}>{date ? `Дата: ${dateShort(date)}` : 'Дата не выбрана'}</div>
        <TextLink caps to={calendarHref}>
          {date ? 'Изменить' : 'Выбрать'}
        </TextLink>
      </div>
      <div className={s.action}>
        {canRequest ? (
          <ButtonLink to={hrefTo(`/items/${item.id}/request`)}>{requestLabel}</ButtonLink>
        ) : (
          <Button disabled>{requestLabel}</Button>
        )}
        <Note center>{note}</Note>
      </div>
    </>
  )
}
