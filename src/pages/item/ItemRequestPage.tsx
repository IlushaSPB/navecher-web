import { useParams } from 'react-router-dom'
import { ComingSoon, HeaderClose, Screen, TaskHeader } from '@/shared/ui'

export function ItemRequestPage() {
  const { id = '' } = useParams()
  return (
    <Screen>
      <TaskHeader title="Запрос" start={<HeaderClose to={`/items/${id}`} />} />
      <ComingSoon>Пару слов владелице и расчёт: аренда, залог, итог при встрече.</ComingSoon>
    </Screen>
  )
}
