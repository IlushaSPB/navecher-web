// Флаги React Router v7, включённые заранее: общие для приложения и тестов, иначе роутер сыплет предупреждениями.
export const ROUTER_FUTURE = {
  v7_relativeSplatPath: true,
  v7_fetcherPersist: true,
  v7_normalizeFormMethod: true,
  v7_partialHydration: true,
  v7_skipActionErrorRevalidation: true,
} as const

export const PROVIDER_FUTURE = { v7_startTransition: true } as const
