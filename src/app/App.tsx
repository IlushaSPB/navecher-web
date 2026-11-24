import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/features/auth'
import { ConfigProvider } from '@/shared/config'
import { router } from './router'

export function App() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </AuthProvider>
    </ConfigProvider>
  )
}
