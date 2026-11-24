import { sessionApi } from '@/entities/session'
import { isApiError, NetworkError, tokenStore, type Session, type User } from '@/shared/api'

// Сценарии сессии без React: что спросить у сервера и что сделать с токеном.

// openSession — вход любым способом: сохраняет токен и отдаёт пользователя.
export async function openSession(login: () => Promise<Session>): Promise<User> {
  const { token, user } = await login()
  tokenStore.set(token)
  return user
}

// closeSession — выход. Токен забываем, даже если сервер недоступен.
export async function closeSession() {
  try {
    await sessionApi.logout()
  } catch {
    /* сессия всё равно закрывается локально */
  } finally {
    tokenStore.clear()
  }
}

export function authErrorText(e: unknown): string {
  if (e instanceof NetworkError) return 'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.'
  if (isApiError(e, 'unauthorized') || isApiError(e, 'forbidden'))
    return 'Telegram не подтвердил вход. Попробуйте ещё раз.'
  return 'Не получилось войти. Попробуйте ещё раз.'
}
