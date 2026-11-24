import { cx } from '@/shared/lib/cx'
import s from './Skeleton.module.css'

// Skeleton — пудровая заготовка на месте ещё не загруженного блока; размеры задаёт className.
export function Skeleton({ className }: { className?: string }) {
  return <span className={cx(s.skeleton, className)} aria-hidden="true" />
}
