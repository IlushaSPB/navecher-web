import type { CSSProperties, ReactNode } from 'react'
import { cx } from '../../lib/cx'
import s from './SegmentedChoice.module.css'

export type ChoiceOption<T extends string | number> = {
  value: T
  label: ReactNode
  hint?: ReactNode // строка капсом под значением: «10%», «15% · советуем»
}

type SegmentedChoiceProps<T extends string | number> = {
  label: string // подпись группы для скринридера
  options: ChoiceOption<T>[]
  value: T | null
  onChange: (value: T) => void
  columns?: number // по умолчанию — все варианты в один ряд
}

// SegmentedChoice — сетка ячеек с одним выбранным вариантом: размер, состояние, цена.
export function SegmentedChoice<T extends string | number>({ label, options, value, onChange, columns }: SegmentedChoiceProps<T>) {
  const style = { '--columns': columns ?? options.length } as CSSProperties
  return (
    <div role="group" aria-label={label} className={s.grid} style={style}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={o.value === value}
          className={cx(s.cell, o.hint !== undefined && s.withHint)}
          onClick={() => onChange(o.value)}
        >
          <span className={s.label}>{o.label}</span>
          {o.hint !== undefined && <span className={s.hint}>{o.hint}</span>}
        </button>
      ))}
    </div>
  )
}
