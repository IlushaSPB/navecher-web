import { useState } from 'react'
import { initials } from '../../lib/format'
import s from './Avatar.module.css'

type AvatarProps = { name: string; photoUrl?: string }

// Avatar — круг 40px: фото из Telegram или инициалы на розовом. Имя рядом подписано текстом, сам круг декоративный.
export function Avatar({ name, photoUrl }: AvatarProps) {
  const [broken, setBroken] = useState(false)
  return (
    <span className={s.avatar} aria-hidden="true">
      {photoUrl && !broken ? <img className={s.photo} src={photoUrl} alt="" onError={() => setBroken(true)} /> : initials(name)}
    </span>
  )
}
