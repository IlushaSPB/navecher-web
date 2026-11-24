import { cx } from '../../lib/cx'
import s from './StepProgress.module.css'

type StepProgressProps = { step: number; total: number }

// StepProgress — полоска шагов под шапкой многошагового сценария.
export function StepProgress({ step, total }: StepProgressProps) {
  return (
    <div
      className={s.progress}
      role="progressbar"
      aria-label={`Шаг ${step} из ${total}`}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={step}
    >
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={cx(s.segment, i < step && s.done)} />
      ))}
    </div>
  )
}
