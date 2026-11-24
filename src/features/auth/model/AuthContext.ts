import { createContext, useContext } from 'react'
import type { TelegramWidgetUser, User } from '@/shared/api'

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous'

export type AuthContextValue = {
  status: AuthStatus
  user: User | null
  error: string | null // почему не получилось войти — для экрана входа
  loginWithWidget(user: TelegramWidgetUser): Promise<void>
  loginWithMiniApp(): Promise<void>
  loginDev(): Promise<void>
  logout(): Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth: нет AuthProvider выше по дереву')
  return ctx
}
