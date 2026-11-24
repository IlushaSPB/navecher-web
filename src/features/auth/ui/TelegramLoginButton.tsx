import { useEffect, useRef } from 'react'
import type { TelegramWidgetUser } from '@/shared/api'
import { useLatest } from '@/shared/lib/useLatest'
import s from './auth.module.css'

// Виджет вызывает глобальную функцию по имени из data-onauth.
const CALLBACK = '__nvTelegramAuth'

declare global {
  interface Window {
    [CALLBACK]?: (user: TelegramWidgetUser) => void
  }
}

type TelegramLoginButtonProps = {
  botUsername: string
  onAuth: (user: TelegramWidgetUser) => void
}

// TelegramLoginButton — Telegram Login Widget. Работает только на домене, заданном боту в @BotFather (/setdomain).
export function TelegramLoginButton({ botUsername, onAuth }: TelegramLoginButtonProps) {
  const box = useRef<HTMLDivElement>(null)
  const handler = useLatest(onAuth)

  useEffect(() => {
    const el = box.current
    if (!el) return
    window[CALLBACK] = (user) => handler.current(user)
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.dataset.telegramLogin = botUsername
    script.dataset.size = 'large'
    script.dataset.radius = '0'
    script.dataset.requestAccess = 'write'
    script.dataset.onauth = `${CALLBACK}(user)`
    el.appendChild(script)
    return () => {
      el.replaceChildren()
      delete window[CALLBACK]
    }
  }, [botUsername, handler])

  return <div ref={box} className={s.widget} />
}
