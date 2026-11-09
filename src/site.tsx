import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react'
import { botLink, type SiteConfig } from './api'
import { goal } from './metrics'

// Общее для страниц сайта: настройки с сервера и короткие подсказки внизу экрана.
type Site = { cfg: SiteConfig | null; notify: (text: string) => void }

export const SiteCtx = createContext<Site>({ cfg: null, notify: () => undefined })

export const useSite = () => useContext(SiteCtx)

const DEMO_LEND = 'В демо-версии бот не подключён. В рабочей откроется Telegram: фото, цена, метро — пара минут.'

// LendLink — «Сдать вещь»: ссылка в бота, а без бота (демо) — кнопка с подсказкой вместо пустой ссылки.
export function LendLink({ className, children }: { className?: string; children: ReactNode }) {
  const { cfg, notify } = useSite()
  const href = botLink(cfg, 'lend_web')
  if (!href) {
    return (
      <button type="button" className={className} onClick={() => notify(DEMO_LEND)}>
        {children}
      </button>
    )
  }
  return (
    <a className={className} href={href} target="_blank" rel="noopener" onClick={() => goal('lend_click')}>
      {children}
    </a>
  )
}

// Notice — подсказка внизу экрана; исчезает сама. Живёт в верхнем слое (popover),
// чтобы быть видной и поверх открытого окна вещи (<dialog>).
export function Notice({ text }: { text: string | null }) {
  const ref = useRef<HTMLParagraphElement>(null)
  useEffect(() => {
    const el = ref.current as (HTMLParagraphElement & { showPopover?: () => void; hidePopover?: () => void }) | null
    if (!el?.showPopover) return
    // скрыть и показать заново — так подсказка встаёт поверх диалога, открытого после прошлой
    try {
      el.hidePopover?.()
    } catch {
      /* уже скрыта */
    }
    if (text) {
      try {
        el.showPopover()
      } catch {
        /* уже показана */
      }
    }
  }, [text])
  return (
    <p ref={ref} className={`notice${text ? ' is-on' : ''}`} role="status" {...{ popover: 'manual' }}>
      {text}
    </p>
  )
}
