import { hasMeasureNumbers, MEASUREMENT_LABELS, type MeasurementKey } from '@/entities/item'
import type { Measurements } from '@/shared/api'
import s from './ItemMeasurements.module.css'

const KEYS = Object.keys(MEASUREMENT_LABELS) as MeasurementKey[]

// ItemMeasurements — замеры в см четырьмя колонками; если чисел нет — текст владелицы.
export function ItemMeasurements({ measurements: m }: { measurements: Measurements }) {
  if (!hasMeasureNumbers(m)) return m.text ? <p className={s.block}>{m.text}</p> : null
  return (
    <dl className={s.grid} aria-label="Замеры, см">
      {KEYS.map((k) => (
        <div key={k} className={s.cell}>
          <dt className={s.label}>{MEASUREMENT_LABELS[k]}</dt>
          <dd className={s.value}>{m[k] ?? '—'}</dd>
        </div>
      ))}
    </dl>
  )
}
