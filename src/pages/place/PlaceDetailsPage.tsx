import { ComingSoon, HeaderBack, Screen } from '@/shared/ui'
import { PlaceHeader } from './PlaceHeader'

export function PlaceDetailsPage() {
  return (
    <Screen>
      <PlaceHeader step={2} start={<HeaderBack label="Предыдущий шаг" fallback="/place" />} />
      <ComingSoon>Название, размер, замеры, состояние, цена аренды и залог.</ComingSoon>
    </Screen>
  )
}
