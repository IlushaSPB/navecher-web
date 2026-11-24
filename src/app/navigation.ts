import { ChatsIcon, FavoritesIcon, FeedIcon, PlaceIcon, ProfileIcon, type NavItem } from '@/shared/ui'

// Пункты нижней навигации.
export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Лента', icon: FeedIcon, end: true },
  { to: '/favorites', label: 'Избранное', icon: FavoritesIcon },
  { to: '/place', label: 'Сдать', icon: PlaceIcon },
  { to: '/chats', label: 'Чаты', icon: ChatsIcon },
  { to: '/profile', label: 'Профиль', icon: ProfileIcon },
]
