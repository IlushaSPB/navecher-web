import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement, ReactNode } from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { createQueryClient } from '@/shared/api'
import { PROVIDER_FUTURE, ROUTER_FUTURE } from '@/shared/lib/routerFuture'

// В тестах без повторов: ошибка видна сразу, а не после паузы перед второй попыткой.
export const createTestQueryClient = () => createQueryClient({ retry: false })

// QueryWrapper — обёртка для renderHook: свой кэш на каждый тест.
export function createQueryWrapper(client: QueryClient = createTestQueryClient()) {
  return function QueryWrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
}

type RenderRouteOptions = {
  path?: string // шаблон маршрута: '/items/:id'
  url?: string // открытый адрес: '/items/1?date=2026-12-12'
  client?: QueryClient
}

// renderRoute — экран внутри роутера в памяти и с кэшем запросов, как в приложении.
export function renderRoute(element: ReactElement, { path = '/', url = path, client }: RenderRouteOptions = {}) {
  const router = createMemoryRouter([{ path, element }], { initialEntries: [url], future: ROUTER_FUTURE })
  const Wrapper = createQueryWrapper(client)
  return {
    router,
    user: userEvent.setup(),
    ...render(
      <Wrapper>
        <RouterProvider router={router} future={PROVIDER_FUTURE} />
      </Wrapper>,
    ),
  }
}
