import { QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { createQueryClient } from '@/shared/api'

// QueryProvider — кэш запросов React Query на всё приложение; настройки по умолчанию — в createQueryClient.
export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => createQueryClient())
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
