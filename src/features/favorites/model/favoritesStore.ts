import { readStorage, writeStorage } from '@/shared/lib/storage'

// Избранное — id платьев в localStorage. Общий стор: сердечки в ленте и на платье меняются вместе,
// изменения из другой вкладки приходят через событие storage.
const KEY = 'nv_favorites'

type Listener = () => void

function load(): ReadonlySet<number> {
  try {
    const parsed: unknown = JSON.parse(readStorage(KEY) ?? '[]')
    return new Set(Array.isArray(parsed) ? parsed.filter(Number.isInteger) : [])
  } catch {
    return new Set()
  }
}

let ids = load()
const listeners = new Set<Listener>()
const emit = () => listeners.forEach((l) => l())

function onStorage(e: StorageEvent) {
  if (e.key !== KEY) return
  ids = load()
  emit()
}

export const favoritesStore = {
  subscribe(listener: Listener) {
    if (!listeners.size) window.addEventListener('storage', onStorage)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
      if (!listeners.size) window.removeEventListener('storage', onStorage)
    }
  },
  getSnapshot: (): ReadonlySet<number> => ids,
  toggle(id: number) {
    const next = new Set(ids)
    if (!next.delete(id)) next.add(id)
    ids = next
    writeStorage(KEY, JSON.stringify([...next]))
    emit()
  },
}
