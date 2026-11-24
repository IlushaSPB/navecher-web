import { useEffect } from 'react'
import { useLatest } from '../lib/useLatest'
import { getMiniApp } from './webApp'

// useTelegramBackButton — показывает нативную кнопку «Назад» Telegram, пока компонент на экране.
// Возвращает true, если кнопку взял на себя Telegram (внутри мини-аппа) — свою тогда не рисуем.
export function useTelegramBackButton(onBack: () => void): boolean {
  const app = getMiniApp()
  const supported = !!app?.isVersionAtLeast('6.1')
  const handler = useLatest(onBack)

  useEffect(() => {
    if (!app || !supported) return
    const cb = () => handler.current()
    app.BackButton.onClick(cb)
    app.BackButton.show()
    return () => {
      app.BackButton.offClick(cb)
      app.BackButton.hide()
    }
  }, [app, supported, handler])

  return supported
}
