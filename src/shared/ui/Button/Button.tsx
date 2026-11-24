import type { ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { cx } from '../../lib/cx'
import s from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary'

type VariantProps = { variant?: ButtonVariant }

const buttonClass = (variant: ButtonVariant, className?: string) => cx(s.button, s[variant], className)

// Button — кнопка действия во всю ширину: основная (чёрная) или второстепенная (контур).
export function Button({ variant = 'primary', className, type = 'button', ...rest }: VariantProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={buttonClass(variant, className)} {...rest} />
}

// ButtonLink — переход, который выглядит как кнопка.
export function ButtonLink({ variant = 'primary', className, ...rest }: VariantProps & LinkProps) {
  return <Link className={buttonClass(variant, className)} {...rest} />
}
