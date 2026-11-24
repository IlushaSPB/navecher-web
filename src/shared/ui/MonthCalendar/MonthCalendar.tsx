import type { ReactNode } from 'react'
import { cx } from '@/shared/lib/cx'
import { addMonths, monthGrid, monthOf, type IsoDate, type IsoMonth, type MonthCell } from '@/shared/lib/date'
import { dateLong, monthTitle, WEEKDAYS_SHORT } from '@/shared/lib/format'
import { ChevronLeftIcon, ChevronRightIcon } from '../Icon/icons'
import { Eyebrow } from '../Typography/Typography'
import s from './MonthCalendar.module.css'

// DayMark — что календарь знает о дне сверх «прошло / выбрано»: свободен, занят, ещё неизвестно.
export type DayMark = { tone?: 'free' | 'busy'; disabled?: boolean }

const NO_MARK: DayMark = {}

type MonthCalendarProps = {
  month: IsoMonth
  onMonthChange(month: IsoMonth): void
  minDate: IsoDate // дни раньше — бледные и недоступны; в прошлые месяцы не листаем
  selected: IsoDate | null
  onSelect(date: IsoDate): void
  markDay?: (date: IsoDate) => DayMark // стратегия разметки дней: занятость платья
  variant?: 'inline' | 'page' // inline — в секции фильтров, page — главный блок экрана
  title?: ReactNode // inline: надпись секции слева от листалки
}

// MonthCalendar — месяц с понедельника: листалка, дни недели, сетка дней.
export function MonthCalendar({
  month,
  onMonthChange,
  minDate,
  selected,
  onSelect,
  markDay,
  variant = 'inline',
  title,
}: MonthCalendarProps) {
  const label = monthTitle(month)
  return (
    <div className={cx(s.calendar, s[variant])}>
      <div className={s.head}>
        {title !== undefined && (
          <Eyebrow as="h2" tone="muted">
            {title}
          </Eyebrow>
        )}
        <div className={s.nav}>
          <button
            type="button"
            className={s.arrow}
            aria-label="Предыдущий месяц"
            disabled={month <= monthOf(minDate)}
            onClick={() => onMonthChange(addMonths(month, -1))}
          >
            <ChevronLeftIcon />
          </button>
          <div className={s.month} aria-live="polite">
            {label}
          </div>
          <button
            type="button"
            className={s.arrow}
            aria-label="Следующий месяц"
            onClick={() => onMonthChange(addMonths(month, 1))}
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>
      <div className={s.weekdays} aria-hidden="true">
        {WEEKDAYS_SHORT.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className={s.grid} role="group" aria-label={label}>
        {monthGrid(month).map((cell) => (
          <Day
            key={cell.date}
            cell={cell}
            past={cell.date < minDate}
            selected={cell.date === selected}
            mark={markDay?.(cell.date) ?? NO_MARK}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}

type DayProps = { cell: MonthCell; past: boolean; selected: boolean; mark: DayMark; onSelect(date: IsoDate): void }

function Day({ cell, past, selected, mark, onSelect }: DayProps) {
  const faded = past || !cell.inMonth
  const tone = faded ? undefined : mark.tone
  const busy = tone === 'busy'
  const disabled = faded || busy || !!mark.disabled
  return (
    <button
      type="button"
      className={s.day}
      disabled={disabled}
      aria-pressed={selected && !disabled}
      aria-label={busy ? `${dateLong(cell.date)}, занято` : dateLong(cell.date)}
      onClick={() => onSelect(cell.date)}
    >
      <span className={cx(s.mark, faded && s.faded, tone && s[tone], selected && !disabled && s.selected)}>
        {cell.day}
      </span>
    </button>
  )
}

// CalendarLegend — расшифровка разметки: выбрано, свободно, занято.
export function CalendarLegend() {
  return (
    <ul className={s.legend}>
      <li>
        <span className={cx(s.swatch, s.selected)} aria-hidden="true" />
        Выбрано
      </li>
      <li>
        <span className={cx(s.swatch, s.free)} aria-hidden="true" />
        Свободно
      </li>
      <li>
        <span className={s.busy} aria-hidden="true">
          19
        </span>
        Занято
      </li>
    </ul>
  )
}
