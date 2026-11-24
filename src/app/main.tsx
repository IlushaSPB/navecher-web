import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/shared/styles/fonts'
import '@/shared/styles/global.css'
import { initMiniApp } from '@/shared/telegram'
import { App } from './App'

// npm run dev:mock — ответы API подставляет MSW прямо в браузере, бэкенд не нужен.
// В сборку для прода этот код не попадает: MODE там всегда production.
async function enableMocks() {
  if (import.meta.env.MODE !== 'mock') return
  const { startMockWorker } = await import('@/shared/api/mocks/browser')
  await startMockWorker()
}

// Внутри Telegram — сразу готовность, полный экран и цвет шапки; на сайте ничего не делает.
initMiniApp()

void enableMocks().then(() =>
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  ),
)
