import type { ReactNode } from 'react'
import s from './ReceiptRows.module.css'

// Receipt — расчёт «аренда + залог = при встрече»: список ReceiptRow и ReceiptTotal.
export function Receipt({ children }: { children: ReactNode }) {
  return <dl className={s.receipt}>{children}</dl>
}

type RowProps = { label: ReactNode; value: ReactNode }

export function ReceiptRow({ label, value }: RowProps) {
  return (
    <div className={s.row}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

// ReceiptTotal — итог под чертой.
export function ReceiptTotal({ label, value }: RowProps) {
  return (
    <div className={s.total}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}
