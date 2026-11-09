import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter-tight'
import '@fontsource/ibm-plex-mono/latin-400.css'
import '@fontsource/ibm-plex-mono/cyrillic-400.css'
import '@fontsource/noto-serif-display/latin-300.css'
import '@fontsource/noto-serif-display/cyrillic-300.css'
import '@fontsource/noto-serif-display/latin-400.css'
import '@fontsource/noto-serif-display/cyrillic-400.css'
import './styles.css'
import { initTheme } from './theme'

// Сайт и прототип приложения (/app) грузятся отдельными кусками: каждой странице — только своё.
const App = lazy(() => import('./App'))
const Prototype = lazy(() => import('./proto/Prototype'))

const path = window.location.pathname.replace(/\/+$/, '')

initTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>{path === '/app' ? <Prototype /> : <App page={path === '/rules' ? 'rules' : 'home'} />}</Suspense>
  </StrictMode>,
)
