import type { CSSProperties } from 'react'
import s from './RangeSlider.module.css'

type RangeSliderProps = {
  label: string // подпись для скринридера
  min: number
  max: number
  step: number
  value: number
  onChange(value: number): void
  valueText?: string // как озвучить значение: «до 5 000 ₽»
}

// RangeSlider — нативный ползунок: линия 2px, пройденная часть чёрная, круг 16px.
export function RangeSlider({ label, min, max, step, value, onChange, valueText }: RangeSliderProps) {
  const share = max > min ? (Math.min(Math.max(value, min), max) - min) / (max - min) : 0
  return (
    <input
      type="range"
      className={s.range}
      aria-label={label}
      aria-valuetext={valueText}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ '--share': share } as CSSProperties}
    />
  )
}
