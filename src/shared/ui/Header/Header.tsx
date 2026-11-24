import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { cx } from '@/shared/lib/cx'
import { useGoBack } from '@/shared/lib/useGoBack'
import { useTelegramBackButton } from '@/shared/telegram'
import { BackIcon, CloseIcon } from '../Icon/icons'
import { IconButton } from '../IconButton/IconButton'
import { TextButton } from '../TextLink/TextLink'
import { Wordmark } from '../Wordmark/Wordmark'
import s from './Header.module.css'

type BarProps = { className: string; start?: ReactNode; center: ReactNode; end?: ReactNode }

function HeaderBar({ className, start, center, end }: BarProps) {
  return (
    <header className={cx(s.bar, className)}>
      <div className={s.start}>{start}</div>
      <div className={s.center}>{center}</div>
      <div className={s.end}>{end}</div>
    </header>
  )
}

// ShowcaseHeader — шапка витрины: знак по центру, справа необязательное действие (поиск).
export function ShowcaseHeader({ end }: { end?: ReactNode }) {
  return <HeaderBar className={s.showcase} center={<Wordmark />} end={end} />
}

type TaskHeaderProps = {
  title: ReactNode
  subtitle?: ReactNode
  start?: ReactNode // HeaderBack или HeaderClose
  end?: ReactNode // действие справа: IconButton, TextButton, HeaderCounter
  divider?: boolean
}

// TaskHeader — шапка экрана-задачи: назад/закрыть, заголовок капсом, действие справа.
export function TaskHeader({ title, subtitle, start, end, divider = true }: TaskHeaderProps) {
  return (
    <HeaderBar
      className={cx(s.task, subtitle !== undefined && s.tall, divider && s.divider)}
      start={start}
      center={
        <>
          <div className={s.title}>{title}</div>
          {subtitle !== undefined && <div className={s.subtitle}>{subtitle}</div>}
        </>
      }
      end={end}
    />
  )
}

type HeaderBackProps = { label?: string; fallback?: string }

// HeaderBack — «Назад». В мини-аппе его роль берёт нативная кнопка Telegram, своя не рисуется.
export function HeaderBack({ label = 'Назад', fallback = '/' }: HeaderBackProps) {
  const goBack = useGoBack(fallback)
  const native = useTelegramBackButton(goBack)
  if (native) return null
  return (
    <IconButton label={label} onClick={goBack}>
      <BackIcon />
    </IconButton>
  )
}

type HeaderCloseProps = {
  label?: string
  to: string
  back?: boolean // вернуться по истории (лента с прежней прокруткой); to — если экран открыт первым
}

// HeaderClose — выход из задачи (фильтры, размещение) в указанный раздел.
export function HeaderClose({ label = 'Закрыть', to, back = false }: HeaderCloseProps) {
  const navigate = useNavigate()
  const goBack = useGoBack(to)
  return (
    <IconButton label={label} onClick={() => (back ? goBack() : navigate(to))}>
      <CloseIcon />
    </IconButton>
  )
}

// HeaderCounter — номер шага «1 / 2» справа в шапке.
export function HeaderCounter({ step, total }: { step: number; total: number }) {
  return (
    <div className={s.counter} aria-hidden="true">
      {step} / {total}
    </div>
  )
}

// HeaderTextAction — текстовое действие справа в шапке («Сбросить»).
export function HeaderTextAction({ className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <TextButton tone="muted" className={cx(s.textAction, className)} {...rest} />
}
