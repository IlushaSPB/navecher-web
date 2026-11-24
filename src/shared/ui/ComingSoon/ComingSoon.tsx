import type { ReactNode } from 'react'
import { Eyebrow, Note } from '../Typography/Typography'
import s from './ComingSoon.module.css'

// ComingSoon — заглушка экрана, который ещё делается.
export function ComingSoon({ children }: { children?: ReactNode }) {
  return (
    <div className={s.soon}>
      <Eyebrow tone="accent">Скоро</Eyebrow>
      {children !== undefined && <Note>{children}</Note>}
    </div>
  )
}
