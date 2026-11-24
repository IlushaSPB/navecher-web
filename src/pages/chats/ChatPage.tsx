import { useNavigate, useParams } from 'react-router-dom'
import { ComingSoon, HeaderBack, IconButton, InfoIcon, Screen, TaskHeader } from '@/shared/ui'

export function ChatPage() {
  const { dealId = '' } = useParams()
  const navigate = useNavigate()
  return (
    <Screen>
      <TaskHeader
        title="Диалог"
        start={<HeaderBack label="Назад к чатам" fallback="/chats" />}
        end={
          <IconButton label="Статус сделки" onClick={() => navigate(`/deals/${dealId}`)}>
            <InfoIcon />
          </IconButton>
        }
      />
      <ComingSoon>Переписка по сделке и переход в Telegram.</ComingSoon>
    </Screen>
  )
}
