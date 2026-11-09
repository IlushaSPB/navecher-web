import { useCallback, useEffect, useState } from 'react'

const KEY = 'navecher:saved'

// Сохранённые вещи живут только в браузере. Хранилище может быть недоступно
// (приватный режим, запрет cookies) — тогда просто работаем без него.
function read(): number[] {
  try {
    const raw = localStorage.getItem(KEY)
    const ids = raw ? JSON.parse(raw) : []
    return Array.isArray(ids) ? ids.filter((x) => Number.isInteger(x)) : []
  } catch {
    return []
  }
}

function write(ids: number[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids))
  } catch {
    /* хранилище недоступно */
  }
}

export function useSaved() {
  const [ids, setIds] = useState<number[]>(read)

  // Синхронизация между вкладками.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => e.key === KEY && setIds(read())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const toggle = useCallback((id: number) => {
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]
      write(next)
      return next
    })
  }, [])

  const forget = useCallback((gone: number[]) => {
    setIds((prev) => {
      const next = prev.filter((x) => !gone.includes(x))
      write(next)
      return next
    })
  }, [])

  return { ids, has: (id: number) => ids.includes(id), toggle, forget }
}
