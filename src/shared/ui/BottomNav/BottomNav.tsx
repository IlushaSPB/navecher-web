import type { ComponentType } from 'react'
import { NavLink } from 'react-router-dom'
import { cx } from '@/shared/lib/cx'
import type { IconProps } from '../Icon/icons'
import s from './BottomNav.module.css'

export type NavItem = {
  to: string
  label: string
  icon: ComponentType<IconProps>
  end?: boolean // активен только на точном адресе (для «/»)
}

// BottomNav — нижняя навигация: равные пункты, активный — чёрный с подчёркнутой подписью.
export function BottomNav({ items }: { items: NavItem[] }) {
  return (
    <nav className={s.nav} aria-label="Разделы">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => cx(s.item, isActive && s.active)}>
          <Icon />
          <span className={s.label}>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
