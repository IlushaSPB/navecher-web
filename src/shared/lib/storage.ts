// Хранилище может быть недоступно (приватный режим, запрет cookies) — тогда просто работаем без него.

export function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStorage(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    /* хранилище недоступно */
  }
}
