import { ActionBar, ButtonLink, ComingSoon, HeaderClose, Screen } from '@/shared/ui'
import { PlaceHeader } from './PlaceHeader'

export function PlacePhotosPage() {
  return (
    <Screen>
      <PlaceHeader step={1} start={<HeaderClose label="Закрыть, черновик сохранится" to="/" />} />
      <ComingSoon>3–6 фото при дневном свете: целиком, ткань и бирка, все нюансы.</ComingSoon>
      <ActionBar>
        <ButtonLink to="/place/details">Далее</ButtonLink>
      </ActionBar>
    </Screen>
  )
}
