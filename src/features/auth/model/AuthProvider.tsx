import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authApi, type Session, type TelegramWidgetUser, type User } from '@/shared/api'
import { getMiniApp } from '@/shared/telegram'
import { AuthContext, type AuthContextValue, type AuthStatus } from './AuthContext'
import { authErrorText, closeSession, openSession, restoreSession } from './session'

type State = { status: AuthStatus; user: User | null; error: string | null }

const anonymous = (error: string | null = null): State => ({ status: 'anonymous', user: null, error })
const signedIn = (user: User): State => ({ status: 'authenticated', user, error: null })

// тестовый пользователь для входа без Telegram (DEV_AUTH на сервере)
const DEV_USER = { tgId: 1001, firstName: 'Тест' }

// AuthProvider — сессия пользователя. В мини-аппе входит сам по initData, на сайте — восстанавливает по /api/me.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ status: 'loading', user: null, error: null })

  const signIn = useCallback(async (login: () => Promise<Session>) => {
    setState((s) => ({ ...s, status: 'loading', error: null }))
    try {
      setState(signedIn(await openSession(login)))
    } catch (e) {
      setState(anonymous(authErrorText(e)))
    }
  }, [])

  const loginWithMiniApp = useCallback(async () => {
    const app = getMiniApp()
    if (app) await signIn(() => authApi.loginWebApp(app.initData))
  }, [signIn])

  useEffect(() => {
    if (getMiniApp()) {
      void loginWithMiniApp()
      return
    }
    let cancelled = false
    restoreSession()
      .then((user) => !cancelled && setState(user ? signedIn(user) : anonymous()))
      .catch(() => !cancelled && setState(anonymous()))
    return () => {
      cancelled = true
    }
  }, [loginWithMiniApp])

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      loginWithMiniApp,
      loginWithWidget: (user: TelegramWidgetUser) => signIn(() => authApi.loginWidget(user)),
      loginDev: () => signIn(() => authApi.loginDev(DEV_USER.tgId, DEV_USER.firstName)),
      logout: async () => {
        await closeSession()
        setState(anonymous())
      },
    }),
    [state, signIn, loginWithMiniApp],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
