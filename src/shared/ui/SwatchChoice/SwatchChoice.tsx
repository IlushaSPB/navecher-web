import s from './SwatchChoice.module.css'

export type SwatchOption = { value: string; label: string; color: string }

type SwatchChoiceProps = {
  label: string // подпись группы для скринридера
  options: SwatchOption[]
  value: string | null
  onChange(value: string): void
}

// SwatchChoice — круги цвета 28px с касанием 44px; выбранный обведён кольцом.
export function SwatchChoice({ label, options, value, onChange }: SwatchChoiceProps) {
  return (
    <div role="group" aria-label={label} className={s.row}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={s.cell}
          aria-label={o.label}
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
        >
          <span className={s.swatch} style={{ background: o.color }} />
        </button>
      ))}
    </div>
  )
}
