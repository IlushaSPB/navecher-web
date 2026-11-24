import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { loginPath } from '../lib/loginRedirect'
import { useAuth } from '../model/AuthContext'
import { AuthPending } from './AuthPending'

// RequireAuth — закрытые разделы: без входа ведёт на /login?next=… (в мини-аппе вход идёт сам, ждём его).
export function RequireAuth() {
  const { status } = useAuth()
  const { pathname, search } = useLocation()
  if (status === 'loading') return <AuthPending />
  if (status === 'anonymous') return <Navigate to={loginPath(pathname + search)} replace />
  return <Outlet />
}
