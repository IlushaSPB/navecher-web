import { cx } from '@/shared/lib/cx'
import s from './Wordmark.module.css'

type WordmarkProps = { size?: 'm' | 'l'; className?: string }

// Wordmark — знак NAVECHER: в шапке витрины 24px, на экране входа 28px.
export function Wordmark({ size = 'm', className }: WordmarkProps) {
  return (
    <span className={cx(s.wordmark, s[size], className)} role="img" aria-label="NAVECHER">
      <span aria-hidden="true">
        NA<span className={s.kern}>V</span>
        <span className={s.kern}>E</span>CHER
      </span>
    </span>
  )
}
