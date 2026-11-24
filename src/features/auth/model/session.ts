import { authApi, isApiError, NetworkError, tokenStore, type Session, type User } from '@/shared/api'

// Сценарии сессии без React: что спросить у сервера и что сделать с токеном.

// restoreSession — кто вошёл: по сохранённому токену или cookie. 401 — токен протух, забываем его.
export async function restoreSession(): Promise<User | null> {
  try {
    return await authApi.fetchMe()
  } catch (e) {
    if (isApiError(e, 401)) {
      tokenStore.clear()
      return null
    }
    throw e
  }
}

// openSession — вход любым способом: сохраняет токен и отдаёт пользователя.
export async function openSession(login: () => Promise<Session>): Promise<User> {
  const { token, user } = await login()
  tokenStore.set(token)
  return user
}

// closeSession — выход. Токен забываем, даже если сервер недоступен.
export async function closeSession() {
  try {
    await authApi.logout()
  } catch {
    /* сессия всё равно закрывается локально */
  } finally {
    tokenStore.clear()
  }
}

export function authErrorText(e: unknown): string {
  if (e instanceof NetworkError) return 'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.'
  if (isApiError(e, 401) || isApiError(e, 403)) return 'Telegram не подтвердил вход. Попробуйте ещё раз.'
  return 'Не получилось войти. Попробуйте ещё раз.'
}
