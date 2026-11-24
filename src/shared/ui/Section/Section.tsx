import type { ReactNode } from 'react'
import { cx } from '../../lib/cx'
import { Eyebrow } from '../Typography/Typography'
import s from './Section.module.css'

type SectionProps = {
  title?: ReactNode // надпись капсом над содержимым (h2)
  aside?: ReactNode // справа от надписи: значение, переключатель месяца
  loose?: boolean // увеличенный отступ сверху между крупными блоками
  className?: string
  children: ReactNode
}

// Section — блок экрана с полями 16px и необязательной надписью.
export function Section({ title, aside, loose, className, children }: SectionProps) {
  return (
    <section className={cx(s.section, loose && s.loose, className)}>
      {(title !== undefined || aside !== undefined) && (
        <div className={s.head}>
          {title !== undefined && (
            <Eyebrow as="h2" tone="muted">
              {title}
            </Eyebrow>
          )}
          {aside !== undefined && <div className={s.aside}>{aside}</div>}
        </div>
      )}
      {children}
    </section>
  )
}

// Hairline — разделитель 1px; inset — с полями 16px.
export function Hairline({ inset }: { inset?: boolean }) {
  return <hr className={cx(s.hairline, inset && s.inset)} />
}

// Panel — пудровая плашка во всю ширину.
export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx(s.panel, className)}>{children}</div>
}
