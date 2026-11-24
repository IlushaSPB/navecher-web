import { useAuth } from '@/features/auth'
import { ComingSoon, Eyebrow, Screen, TextButton, Title } from '@/shared/ui'
import s from './ProfilePage.module.css'

export function ProfilePage() {
  const { user, logout } = useAuth()
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ')
  return (
    <Screen>
      <header className={s.head}>
        <Eyebrow tone="muted">Профиль{name && ` · ${name}`}</Eyebrow>
        <Title size="l">Мои сделки</Title>
      </header>
      <ComingSoon>Сделки, где вы берёте и сдаёте платья, заработок и рейтинг.</ComingSoon>
      <TextButton tone="muted" className={s.logout} onClick={() => void logout()}>
        Выйти
      </TextButton>
    </Screen>
  )
}
