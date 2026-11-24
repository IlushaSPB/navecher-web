import type { ReactNode } from 'react'
import { cx } from '../../lib/cx'
import s from './StatusTag.module.css'

export type StatusTone = 'accent' | 'ink' | 'muted' | 'solid'

type StatusTagProps = { tone?: StatusTone; className?: string; children: ReactNode }

// StatusTag — плашка статуса капсом 10px в рамке: «Подтверждено», «Завершена», «Обложка».
export function StatusTag({ tone = 'ink', className, children }: StatusTagProps) {
  return <span className={cx(s.tag, s[tone], className)}>{children}</span>
}
