import { createBrowserRouter } from 'react-router-dom'
import { RequireAuth } from '@/features/auth'
import { ChatPage } from '@/pages/chats/ChatPage'
import { ChatsPage } from '@/pages/chats/ChatsPage'
import { DealPage } from '@/pages/deal/DealPage'
import { ErrorPage } from '@/pages/error/ErrorPage'
import { FavoritesPage } from '@/pages/favorites/FavoritesPage'
import { FeedPage } from '@/pages/feed/FeedPage'
import { FiltersPage } from '@/pages/filters/FiltersPage'
import { ItemCalendarPage } from '@/pages/item/ItemCalendarPage'
import { ItemPage } from '@/pages/item/ItemPage'
import { ItemRequestPage } from '@/pages/item/ItemRequestPage'
import { LoginPage } from '@/pages/login/LoginPage'
import { NotFoundPage } from '@/pages/not-found/NotFoundPage'
import { PlaceDetailsPage } from '@/pages/place/PlaceDetailsPage'
import { PlacePhotosPage } from '@/pages/place/PlacePhotosPage'
import { ProfilePage } from '@/pages/profile/ProfilePage'
import { RulesPage } from '@/pages/rules/RulesPage'
import { OwnerRequestPage } from '@/pages/request/OwnerRequestPage'
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
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
)
