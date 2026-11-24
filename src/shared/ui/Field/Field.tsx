import {
  createContext,
  useContext,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react'
import { cx } from '@/shared/lib/cx'
import s from './Field.module.css'

type FieldIds = { id: string; hintId?: string }

const FieldContext = createContext<FieldIds | null>(null)

// useFieldIds — id поля и подсказки из ближайшего Field: связывает label, input и aria-describedby.
function useFieldIds(id?: string, describedBy?: string) {
  const ctx = useContext(FieldContext)
  return { id: id ?? ctx?.id, 'aria-describedby': describedBy ?? ctx?.hintId }
}

type FieldProps = {
  label: ReactNode
  hint?: ReactNode
  className?: string
  children: ReactNode // TextInput или TextArea
}

// Field — подпись капсом, поле и подсказка под ним.
export function Field({ label, hint, className, children }: FieldProps) {
  const id = useId()
  const hintId = hint !== undefined ? `${id}-hint` : undefined
  return (
    <FieldContext.Provider value={{ id, hintId }}>
      <div className={cx(s.field, className)}>
        <label htmlFor={id} className={s.label}>
          {label}
        </label>
        {children}
        {hint !== undefined && (
          <p id={hintId} className={s.hint}>
            {hint}
          </p>
        )}
      </div>
    </FieldContext.Provider>
  )
}

type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & { size?: 'm' | 'l' }

// TextInput — однострочное поле с нижней линией: m — формы (14px), l — сообщение (16px).
export function TextInput({
  size = 'm',
  className,
  id,
  'aria-describedby': describedBy,
  type = 'text',
  ...rest
}: TextInputProps) {
  const ids = useFieldIds(id, describedBy)
  return <input type={type} className={cx(s.control, s[size], className)} {...ids} {...rest} />
}

// TextArea — многострочное поле с нижней линией.
export function TextArea({
  className,
  id,
  'aria-describedby': describedBy,
  rows = 3,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ids = useFieldIds(id, describedBy)
  return <textarea rows={rows} className={cx(s.control, s.area, className)} {...ids} {...rest} />
}
