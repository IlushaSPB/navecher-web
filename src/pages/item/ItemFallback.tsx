import { ActionBar, ButtonLink, HeaderBack, Note, Screen, Section, TaskHeader, TextButton } from '@/shared/ui'

type ItemFallbackProps = { title: string; onRetry?: () => void }

// ItemFallback — платье не открылось: сняли с витрины (onRetry нет) или не дошёл запрос.
export function ItemFallback({ title, onRetry }: ItemFallbackProps) {
  return (
    <Screen>
      <TaskHeader title={title} start={<HeaderBack label="Назад в ленту" fallback="/" />} />
      <Section>
        {onRetry ? (
          <>
            <Note>Не получилось загрузить платье. Проверьте связь и попробуйте ещё раз.</Note>
            <TextButton onClick={onRetry}>Повторить</TextButton>
          </>
        ) : (
          <Note>Этого платья больше нет на витрине — возможно, владелица его сняла.</Note>
        )}
      </Section>
      <ActionBar>
        <ButtonLink to="/">В ленту</ButtonLink>
      </ActionBar>
    </Screen>
  )
}
