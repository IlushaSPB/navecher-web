import type { ReactNode } from 'react'
import { cx } from '../../lib/cx'
import s from './Typography.module.css'

type Tone = 'ink' | 'muted' | 'accent'

type EyebrowProps = {
  as?: 'div' | 'span' | 'h2' | 'h3' | 'p'
  tone?: Tone
  className?: string
  children: ReactNode
}

// Eyebrow — надпись капсом над заголовком или секцией.
export function Eyebrow({ as: Tag = 'div', tone = 'ink', className, children }: EyebrowProps) {
  return <Tag className={cx(s.eyebrow, s[tone], className)}>{children}</Tag>
}

type TitleProps = {
  as?: 'h1' | 'h2' | 'h3' | 'div'
  size?: 'm' | 'l'
  className?: string
  children: ReactNode
}

// Title — заголовок экрана: Jost капсом, 22 или 28px.
export function Title({ as: Tag = 'h1', size = 'm', className, children }: TitleProps) {
  return <Tag className={cx(s.title, s[size], className)}>{children}</Tag>
}

type NoteProps = { center?: boolean; className?: string; children: ReactNode }

// Note — второстепенный поясняющий текст.
export function Note({ center, className, children }: NoteProps) {
  return <p className={cx(s.note, center && s.center, className)}>{children}</p>
}
