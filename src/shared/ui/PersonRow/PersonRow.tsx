import type { ReactNode } from 'react'
import { cx } from '../../lib/cx'
import { Avatar } from '../Avatar/Avatar'
import s from './PersonRow.module.css'

type PersonRowProps = { name: string; meta?: ReactNode; photoUrl?: string; className?: string }

// PersonRow — аватар, имя и строка под ним: владелица платья, собеседница.
export function PersonRow({ name, meta, photoUrl, className }: PersonRowProps) {
  return (
    <div className={cx(s.row, className)}>
      <Avatar name={name} photoUrl={photoUrl} />
      <div className={s.text}>
        <div className={s.name}>{name}</div>
        {meta && <div className={s.meta}>{meta}</div>}
      </div>
    </div>
  )
}
