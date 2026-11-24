import { readStorage, writeStorage } from '@/shared/lib/storage'

// Токен сессии: в памяти и в localStorage, чтобы пережить перезагрузку.
const KEY = 'nv_token'

let current: string | null = readStorage(KEY)

export const tokenStore = {
  get: (): string | null => current,
  set(token: string) {
    current = token
    writeStorage(KEY, token)
  },
  clear() {
    current = null
    writeStorage(KEY, null)
  },
}
