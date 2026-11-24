import type { ReactNode } from 'react'
import { cx } from '@/shared/lib/cx'
import s from './Screen.module.css'

// Screen — колонка экрана: шапка, содержимое, ActionBar внизу.
export function Screen({ className, children }: { className?: string; children: ReactNode }) {
  return <main className={cx(s.screen, className)}>{children}</main>
}

type ActionBarProps = { divider?: boolean; children: ReactNode }

// ActionBar — главные кнопки экрана, прижаты к низу.
export function ActionBar({ divider, children }: ActionBarProps) {
  return <div className={cx(s.actions, divider && s.divider)}>{children}</div>
}
