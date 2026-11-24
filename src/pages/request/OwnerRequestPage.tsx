import { ComingSoon, HeaderBack, Screen, TaskHeader } from '@/shared/ui'

// Запрос арендатора глазами владелицы.
export function OwnerRequestPage() {
  return (
    <Screen>
      <TaskHeader title="Запрос на вечер" start={<HeaderBack label="Назад к сделкам" fallback="/profile" />} />
      <ComingSoon>Дата, платье, арендатор и расчёт — подтвердить вечер или отказать.</ComingSoon>
    </Screen>
  )
}
