import { createContext, useContext } from 'react'
import type { Item, SiteConfig } from '../api'
import type { useSaved } from '../useSaved'
import type { useTheme } from '../theme'
import type { Booking, MyItem } from './data'

export type Tab = 'home' | 'search' | 'bookings' | 'profile'

// Route — экран поверх вкладок: открывается сдвигом справа (lend — снизу, как модальное окно).
export type Route =
  | { name: 'item'; item: Item }
  | { name: 'book'; item: Item; date: string }
  | { name: 'chat'; id: string }
  | { name: 'saved' }
  | { name: 'mine' }
  | { name: 'lend' }
  | { name: 'rules' }

export type Proto = {
  cfg: SiteConfig | null
  items: Item[]
  loading: boolean
  tab: Tab
  setTab: (t: Tab) => void
  push: (r: Route) => void
  pop: () => void
  replace: (r: Route) => void
  saved: ReturnType<typeof useSaved>
  theme: ReturnType<typeof useTheme>
  bookings: Booking[]
  typing: string | null
  book: (item: Item, date: string, time: string, method: Booking['method']) => string
  send: (id: string, text: string) => void
  advance: (id: string) => void
  rate: (id: string, stars: number) => void
  mine: MyItem[]
  addMine: (m: MyItem) => void
  togglePause: (id: string) => void
  toast: (text: string) => void
}

export const ProtoCtx = createContext<Proto | null>(null)

export function useProto() {
  const v = useContext(ProtoCtx)
  if (!v) throw new Error('useProto вне прототипа')
  return v
}
