import { createBrowserRouter } from 'react-router-dom'
import { RequireAuth } from '@/features/auth'
import { ChatPage, ChatsPage } from '@/pages/chats'
import { DealPage } from '@/pages/deal'
import { ErrorPage } from '@/pages/error'
import { FavoritesPage } from '@/pages/favorites'
import { FeedPage } from '@/pages/feed'
import { FiltersPage } from '@/pages/filters'
import { ItemCalendarPage, ItemPage, ItemRequestPage } from '@/pages/item'
import { LoginPage } from '@/pages/login'
import { NotFoundPage } from '@/pages/not-found'
import { PlaceDetailsPage, PlacePhotosPage } from '@/pages/place'
import { ProfilePage } from '@/pages/profile'
import { OwnerRequestPage } from '@/pages/request'
import { RulesPage } from '@/pages/rules'
import { ROUTER_FUTURE } from '@/shared/lib/routerFuture'
import { AppShell } from './layouts/AppShell'
import { TabLayout } from './layouts/TabLayout'

// Карта экранов. Разделы с нижней навигацией — в TabLayout, закрытые — под RequireAuth.
export const router = createBrowserRouter(
  [
    {
      element: <AppShell />,
      errorElement: <ErrorPage />,
      children: [
        {
          element: <TabLayout />,
          children: [
            { index: true, element: <FeedPage /> },
            {
              element: <RequireAuth />,
              children: [
                { path: 'favorites', element: <FavoritesPage /> },
                { path: 'chats', element: <ChatsPage /> },
                { path: 'profile', element: <ProfilePage /> },
              ],
            },
          ],
        },
        { path: 'filters', element: <FiltersPage /> },
        { path: 'items/:id', element: <ItemPage /> },
        { path: 'items/:id/calendar', element: <ItemCalendarPage /> },
        { path: 'items/:id/request', element: <ItemRequestPage /> },
        { path: 'rules', element: <RulesPage /> },
        { path: 'login', element: <LoginPage /> },
        {
          element: <RequireAuth />,
          children: [
            { path: 'chats/:dealId', element: <ChatPage /> },
            { path: 'deals/:dealId', element: <DealPage /> },
            { path: 'place', element: <PlacePhotosPage /> },
            { path: 'place/details', element: <PlaceDetailsPage /> },
            { path: 'requests/:id', element: <OwnerRequestPage /> },
          ],
        },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  { future: ROUTER_FUTURE },
)
