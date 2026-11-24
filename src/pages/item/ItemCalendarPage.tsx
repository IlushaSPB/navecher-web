import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ItemSummary, useAvailability } from '@/entities/item'
import { useCatalogFilters } from '@/features/catalog-filters'
import type { Item } from '@/shared/api'
import { monthOf, type IsoDate, type IsoMonth } from '@/shared/lib/date'
import { dateShort } from '@/shared/lib/format'
import {
  ActionBar,
  Button,
  CalendarLegend,
  HeaderBack,
  MonthCalendar,
  Note,
  Screen,
  Skeleton,
  TaskHeader,
  TextButton,
  type DayMark,
} from '@/shared/ui'
import { ItemGate } from './ItemGate'
import s from './ItemCalendarPage.module.css'

const TITLE = 'Свободные даты'

export function ItemCalendarPage() {
  return (
    <ItemGate title={TITLE} skeleton={<CalendarSkeleton />}>
      {(item) => <ItemCalendar item={item} />}
    </ItemGate>
  )
}

const PENDING: DayMark = { disabled: true }
const FREE: DayMark = { tone: 'free' }
const BUSY: DayMark = { tone: 'busy' }

function ItemCalendar({ item }: { item: Item }) {
  const navigate = useNavigate()
  const { filters, hrefTo, today: localToday } = useCatalogFilters()
  const [selected, setSelected] = useState<IsoDate | null>(filters.date)
  const [pickedMonth, setMonth] = useState<IsoMonth | null>(null)
  const month = pickedMonth ?? monthOf(filters.date ?? localToday)
  const availability = useAvailability(item.id, month)
  const today = availability.today ?? localToday
  const itemHref = hrefTo(`/items/${item.id}`)

  // дата из адреса оказалась занята — снимаем выбор, как только узнали
  const selectedBusy = selected !== null && monthOf(selected) === month && availability.busy.has(selected)
  useEffect(() => {
    if (selectedBusy) setSelected(null)
  }, [selectedBusy])

  // стратегия разметки: пока занятость месяца не пришла, дни не выбрать
  const markDay = useCallback(
    (date: IsoDate) => (!availability.loaded ? PENDING : availability.busy.has(date) ? BUSY : FREE),
    [availability.loaded, availability.busy],
  )

  const pickable = selected !== null && selected >= today && !selectedBusy

  return (
    <Screen>
      <TaskHeader title={TITLE} start={<HeaderBack label="Назад к платью" fallback={itemHref} />} />
      <div className={s.summary}>
        <ItemSummary item={item} />
      </div>
      <section className={s.body}>
        <MonthCalendar
          variant="page"
          month={month}
          onMonthChange={setMonth}
          minDate={today}
          selected={selected}
          onSelect={setSelected}
          markDay={markDay}
        />
        {availability.error ? (
          <div>
            <Note>Не получилось загрузить занятые даты.</Note>
            <TextButton onClick={availability.reload}>Повторить</TextButton>
          </div>
        ) : (
          <CalendarLegend />
        )}
      </section>
      <ActionBar divider>
        <Button
          disabled={!pickable}
          onClick={() => selected && navigate(hrefTo(`/items/${item.id}`, { date: selected }), { replace: true })}
        >
          {selected ? `Выбрать ${dateShort(selected)}` : 'Выберите дату'}
        </Button>
      </ActionBar>
    </Screen>
  )
}

function CalendarSkeleton() {
  return (
    <Screen>
      <TaskHeader title={TITLE} start={<HeaderBack label="Назад к платью" />} />
      <div className={s.summary} aria-busy="true" aria-label="Загружаем платье">
        <Skeleton className={s.thumb} />
      </div>
    </Screen>
  )
}
