import { Note } from '@/shared/ui'
import s from './auth.module.css'

// AuthPending — пока выясняем, кто вошёл.
export function AuthPending() {
  return (
    <div className={s.pending} role="status">
      <Note center>Проверяем вход…</Note>
    </div>
  )
}
