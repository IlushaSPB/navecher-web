import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { DevLoginButton, safeNext, TelegramLoginButton, useAuth } from '@/features/auth'
import { useConfig } from '@/shared/config'
import { isMiniApp } from '@/shared/telegram'
import { Button, HeaderClose, Note, Screen, TaskHeader, Wordmark } from '@/shared/ui'
import s from './LoginPage.module.css'

// Способ входа: на сайте — виджет Telegram, в мини-аппе — повтор входа по initData.
function LoginOptions() {
  const { status, loginWithWidget, loginWithMiniApp } = useAuth()
  const { config, failed } = useConfig()

  if (status === 'loading') return <Note center>Входим…</Note>
  if (isMiniApp()) return <Button onClick={() => void loginWithMiniApp()}>Войти через Telegram</Button>
  if (failed) return <Note center>Сервер не отвечает. Обновите страницу чуть позже.</Note>
  if (!config) return null
  return (
    <>
      {config.botUsername ? (
        <TelegramLoginButton botUsername={config.botUsername} onAuth={(user) => void loginWithWidget(user)} />
      ) : (
        <Note center>Вход через Telegram пока не настроен.</Note>
      )}
      {config.devAuth && <DevLoginButton />}
    </>
  )
}

export function LoginPage() {
  const { status, error } = useAuth()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'))

  if (status === 'authenticated') return <Navigate to={next} replace />

  return (
    <Screen>
      <TaskHeader title="Вход" start={<HeaderClose to="/" />} />
      <div className={s.body}>
        <div className={s.intro}>
          <Wordmark size="l" />
          <h1 className={s.lead}>Войдите через Telegram, чтобы бронировать и сдавать платья</h1>
        </div>
        <div className={s.options}>
          <LoginOptions />
          {error && (
            <p className={s.error} role="alert">
              {error}
            </p>
          )}
        </div>
        <Note center>
          Входя, вы принимаете <Link to="/rules" className={s.inlineLink}>
            правила аренды
          </Link>
        </Note>
      </div>
    </Screen>
  )
}
