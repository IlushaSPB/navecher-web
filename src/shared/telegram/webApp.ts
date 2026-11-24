// Адаптер Telegram Mini App. Скрипт telegram-web-app.js подключён в index.html и определяет
// window.Telegram.WebApp и вне Telegram — тогда initData пустой. Мини-апп = WebApp с непустым initData.

type BackButton = {
  show(): void
  hide(): void
  onClick(cb: () => void): void
  offClick(cb: () => void): void
}

export type TelegramWebApp = {
  initData: string
  version: string
  platform: string
  ready(): void
  expand(): void
  close(): void
  setHeaderColor(color: string): void
  setBackgroundColor(color: string): void
  isVersionAtLeast(version: string): boolean
  openTelegramLink(url: string): void
  BackButton: BackButton
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp }
  }
}

// getMiniApp — WebApp, если сайт открыт внутри Telegram; иначе null.
export function getMiniApp(): TelegramWebApp | null {
  const app = window.Telegram?.WebApp
  return app?.initData ? app : null
}

export const isMiniApp = () => getMiniApp() !== null

// цвет из токенов дизайна — чтобы шапка Telegram совпадала с фоном приложения
const cssColor = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()

// initMiniApp — сообщает Telegram, что приложение готово, разворачивает его и красит шапку под фон.
export function initMiniApp() {
  const app = getMiniApp()
  if (!app) return
  app.ready()
  app.expand()
  const ground = cssColor('--c-ground')
  if (ground && app.isVersionAtLeast('6.1')) {
    app.setHeaderColor(ground)
    app.setBackgroundColor(ground)
  }
}
