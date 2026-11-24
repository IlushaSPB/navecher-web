import { ActionBar, Button, Note, Screen, Section, TaskHeader } from '@/shared/ui'

// ErrorPage — экран на случай падения страницы: вместо белого листа — перезагрузка.
export function ErrorPage() {
  return (
    <Screen>
      <TaskHeader title="Ошибка" />
      <Section>
        <Note>Что-то пошло не так. Обновите страницу — обычно это помогает.</Note>
      </Section>
      <ActionBar>
        <Button onClick={() => window.location.reload()}>Обновить</Button>
      </ActionBar>
    </Screen>
  )
}
