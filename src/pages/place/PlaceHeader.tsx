import type { ReactNode } from 'react'
import { HeaderCounter, StepProgress, TaskHeader } from '@/shared/ui'

const STEPS = 2

type PlaceHeaderProps = { step: number; start: ReactNode }

// PlaceHeader — шапка размещения платья: «Разместить», номер шага и полоска прогресса.
export function PlaceHeader({ step, start }: PlaceHeaderProps) {
  return (
    <>
      <TaskHeader title="Разместить" start={start} end={<HeaderCounter step={step} total={STEPS} />} divider={false} />
      <StepProgress step={step} total={STEPS} />
    </>
  )
}
