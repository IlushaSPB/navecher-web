import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { sessionApi, sessionKeys, useMe } from '@/entities/session'
import type { Session, TelegramWidgetUser, User } from '@/shared/api'
import { getMiniApp } from '@/shared/telegram'
import { AuthContext, type AuthContextValue, type AuthStatus } from './AuthContext'
import { authErrorText, closeSession, openSession } from './session'

// тестовый пользователь для входа без Telegram (DEV_AUTH на сервере)
const DEV_USER = { tgId: 1001, firstName: 'Тест' }

const ignore = () => undefined

type StatusInput = { user: User | null | undefined; settled: boolean; busy: boolean }

// пока сессия не выяснена или идёт вход/выход — loading
const authStatus = ({ user, settled, busy }: StatusInput): AuthStatus =>
  busy || !settled ? 'loading' : user ? 'authenticated' : 'anonymous'

// AuthProvider — сессия пользователя. В мини-аппе входит сам по initData, на сайте — восстанавливает по /api/me.
// Пользователь живёт в кэше ['me']: вход и выход кладут туда результат и сбрасывают ключ.
export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [miniApp] = useState(getMiniApp)
  const me = useMe({ enabled: !miniApp })

  const applyUser = useCallback(
    (user: User | null) => {
      queryClient.setQueryData(sessionKeys.me, user)
      void queryClient.invalidateQueries({ queryKey: sessionKeys.me })
    },
    [queryClient],
  )

  const login = useMutation({ mutationFn: openSession, onSuccess: applyUser })
  const logout = useMutation({ mutationFn: closeSession, onSettled: () => applyUser(null) })
  const { mutateAsync: loginAsync, reset: resetLogin } = login

  // ошибка входа остаётся в login.error — наружу промис всегда успешный
  const signIn = useCallback((fn: () => Promise<Session>) => loginAsync(fn).then(ignore, ignore), [loginAsync])

  const loginWithMiniApp = useCallback(async () => {
    if (miniApp) await signIn(() => sessionApi.loginWebApp(miniApp.initData))
  }, [miniApp, signIn])

  useEffect(() => {
    if (miniApp) void loginWithMiniApp()
  }, [miniApp, loginWithMiniApp])

  const status = authStatus({
    user: me.data,
    settled: me.data !== undefined || me.isError || login.isError,
    busy: login.isPending || logout.isPending,
  })
  const user = me.data ?? null
  const error = login.error ? authErrorText(login.error) : null
  const { mutateAsync: logoutAsync } = logout

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      error,
      loginWithMiniApp,
      loginWithWidget: (u: TelegramWidgetUser) => signIn(() => sessionApi.loginWidget(u)),
      loginDev: () => signIn(() => sessionApi.loginDev(DEV_USER.tgId, DEV_USER.firstName)),
      logout: async () => {
        resetLogin()
        await logoutAsync()
      },
    }),
    [status, user, error, loginWithMiniApp, signIn, resetLogin, logoutAsync],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
