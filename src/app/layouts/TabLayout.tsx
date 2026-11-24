import { Outlet } from 'react-router-dom'
import { BottomNav } from '@/shared/ui'
import { NAV_ITEMS } from '../navigation'
import s from './TabLayout.module.css'

// TabLayout — разделы с нижней навигацией: лента, избранное, чаты, профиль.
export function TabLayout() {
  return (
    <>
      <div className={s.content}>
        <Outlet />
      </div>
      <BottomNav items={NAV_ITEMS} />
    </>
  )
}
