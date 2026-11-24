import { useParams } from 'react-router-dom'
import { ActionBar, ButtonLink, ComingSoon, HeaderBack, Screen, TaskHeader } from '@/shared/ui'

export function DealPage() {
  const { dealId = '' } = useParams()
  const chat = `/chats/${dealId}`
  return (
    <Screen>
      <TaskHeader title="Статус сделки" start={<HeaderBack label="Назад к диалогу" fallback={chat} />} />
      <ComingSoon>Встреча, передача, возврат и залог — по шагам.</ComingSoon>
      <ActionBar>
        <ButtonLink to={chat} variant="secondary">
          Открыть диалог
        </ButtonLink>
      </ActionBar>
    </Screen>
  )
}
