import { ActionBar, ButtonLink, HeaderClose, Note, Screen, Section, TaskHeader } from '@/shared/ui'

export function NotFoundPage() {
  return (
    <Screen>
      <TaskHeader title="Не найдено" start={<HeaderClose to="/" />} />
      <Section>
        <Note>Такой страницы нет — возможно, ссылка устарела.</Note>
      </Section>
      <ActionBar>
        <ButtonLink to="/">В ленту</ButtonLink>
      </ActionBar>
    </Screen>
  )
}
