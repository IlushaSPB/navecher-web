import { request } from '../http'
import type { Session, TelegramWidgetUser, User } from '../types'

export const fetchMe = () => request<User>('/api/me')

export const loginWidget = (user: TelegramWidgetUser) =>
  request<Session>('/api/auth/telegram/widget', { method: 'POST', body: user })

export const loginWebApp = (initData: string) =>
  request<Session>('/api/auth/telegram/webapp', { method: 'POST', body: { initData } })

// Вход без Telegram — только локально, когда на сервере DEV_AUTH (иначе 404).
export const loginDev = (tgId: number, firstName: string) =>
  request<Session>('/api/auth/dev', { method: 'POST', body: { tgId, firstName } })

export const logout = () => request<void>('/api/auth/logout', { method: 'POST' })
