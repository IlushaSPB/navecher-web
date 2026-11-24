import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/features/auth'
import { PROVIDER_FUTURE } from '@/shared/lib/routerFuture'
import { QueryProvider } from './providers/QueryProvider'
import { router } from './router'

export function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <RouterProvider router={router} future={PROVIDER_FUTURE} />
      </AuthProvider>
    </QueryProvider>
  )
}
