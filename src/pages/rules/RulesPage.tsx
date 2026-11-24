import { useConfig } from '@/shared/config'
import { Eyebrow, HeaderBack, Note, Panel, Screen, TaskHeader, TextLink } from '@/shared/ui'
import { RULES, RULES_INTRO, type RuleSection } from './rules'
import s from './RulesPage.module.css'

function Rule({ num, rule }: { num: number; rule: RuleSection }) {
  return (
    <section className={s.rule}>
      <div className={s.num} aria-hidden="true">
        {String(num).padStart(2, '0')}
      </div>
      <div className={s.body}>
        <Eyebrow as="h2">{rule.title}</Eyebrow>
        {rule.points.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </section>
  )
}

export function RulesPage() {
  const bot = useConfig().config?.botUsername
  return (
    <Screen className={s.page}>
      <TaskHeader title="Правила аренды" start={<HeaderBack />} />
      <Panel className={s.intro}>{RULES_INTRO}</Panel>
      {RULES.map((rule, i) => (
        <Rule key={rule.title} num={i + 1} rule={rule} />
      ))}
      <div className={s.footer}>
        <Note>На время теста сервис не берёт комиссию. Что-то пошло не так — напишите нам, ответим в течение 24 часов.</Note>
        {bot && (
          <TextLink to={`https://t.me/${bot}`} className={s.support}>
            Написать в поддержку
          </TextLink>
        )}
      </div>
    </Screen>
  )
}
