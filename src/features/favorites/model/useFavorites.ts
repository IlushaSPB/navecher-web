import { useCallback, useSyncExternalStore } from 'react'
import { favoritesStore } from './favoritesStore'

// useFavorites — все сохранённые id (для будущего раздела «Избранное»).
export const useFavorites = () => useSyncExternalStore(favoritesStore.subscribe, favoritesStore.getSnapshot)

// useFavorite — сохранено ли платье и переключатель.
export function useFavorite(id: number): [saved: boolean, toggle: () => void] {
  const saved = useSyncExternalStore(favoritesStore.subscribe, () => favoritesStore.getSnapshot().has(id))
  const toggle = useCallback(() => favoritesStore.toggle(id), [id])
  return [saved, toggle]
}
