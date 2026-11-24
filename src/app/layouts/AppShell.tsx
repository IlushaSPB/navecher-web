import { Outlet, ScrollRestoration } from 'react-router-dom'
import { MetricsTracker } from '../providers/MetricsTracker'
import s from './AppShell.module.css'

// AppShell — корневой макет: колонка приложения, прокрутка (новый экран — сверху, «назад» — где была)
// и счётчик просмотров.
export function AppShell() {
  return (
    <div className={s.column}>
      <Outlet />
      <ScrollRestoration />
      <MetricsTracker />
    </div>
  )
}
