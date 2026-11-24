import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '@/shared/lib/cx'
import s from './IconButton.module.css'

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label' | 'children'> & {
  label: string // обязательная подпись для скринридера
  children: ReactNode
}

// IconButton — квадрат 44×44 с иконкой.
export function IconButton({ label, className, type = 'button', children, ...rest }: IconButtonProps) {
  return (
    <button type={type} aria-label={label} className={cx(s.iconButton, className)} {...rest}>
      {children}
    </button>
  )
}
