import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/shared/styles/fonts'
import '@/shared/styles/global.css'
import { initMiniApp } from '@/shared/telegram'
import { App } from './App'

// Внутри Telegram — сразу готовность, полный экран и цвет шапки; на сайте ничего не делает.
initMiniApp()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
