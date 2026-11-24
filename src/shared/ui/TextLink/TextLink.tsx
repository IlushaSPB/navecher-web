import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { cx } from '../../lib/cx'
import s from './TextLink.module.css'

type Tone = 'ink' | 'muted'

type StyleProps = {
  tone?: Tone
  caps?: boolean // капсом 11px — действие в строке: «Изменить», «Выбрать»
}

const linkClass = (tone: Tone, caps: boolean, className?: string) => cx(s.link, s[tone], caps && s.caps, className)

// TextLink — второстепенный переход подчёркнутым текстом («Правила аренды»).
export function TextLink({ tone = 'ink', caps = false, className, ...rest }: StyleProps & LinkProps) {
  return <Link className={linkClass(tone, caps, className)} {...rest} />
}

// TextAnchor — то же для обычной ссылки: внешний адрес или «#».
export function TextAnchor({ tone = 'ink', caps = false, className, ...rest }: StyleProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={linkClass(tone, caps, className)} {...rest} />
}

// TextButton — второстепенное действие подчёркнутым текстом («Сбросить», «Выйти»).
export function TextButton({ tone = 'ink', caps = false, className, type = 'button', ...rest }: StyleProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={linkClass(tone, caps, className)} {...rest} />
}
