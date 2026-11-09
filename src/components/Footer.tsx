import { botLink } from '../api'
import { hhmm, phrase, type Evening } from '../sun'
import { useSite } from '../site'

type Props = { evening: Evening; home: boolean }

// Footer — всегда вечерний. Вместо огромного логотипа — огромные живые часы
// Москвы: «На вечер» — это про время, и подвал говорит об этом напрямую.
export default function Footer({ evening, home }: Props) {
  const { cfg } = useSite()
  const base = home ? '' : '/'
  const [h, m] = hhmm(evening.now).split(':')
  const bot = botLink(cfg, 'src_web')

  return (
    <footer className="footer" data-theme="night">
      <div className="wrap footer__top">
        <p className="footer__claim">
          Платье на&nbsp;вечер —
          <br />
          из&nbsp;шкафа другой девушки.
        </p>
        <nav className="footer__links" aria-label="Ссылки">
          <a href={`${base}#catalog`}>Каталог</a>
          <a href={`${base}#how`}>Как это устроено</a>
          <a href="/rules">Правила сделки</a>
          <a href="/app">Приложение · прототип</a>
          {bot && (
            <a href={bot} target="_blank" rel="noopener">
              Telegram-бот
            </a>
          )}
          {cfg?.channelUrl && (
            <a href={cfg.channelUrl} target="_blank" rel="noopener">
              Канал
            </a>
          )}
        </nav>
      </div>

      <div className="footer__clock" data-reveal>
        <p className="footer__clock-label">{cfg?.city ?? 'Москва'}, сейчас</p>
        <p className="footer__time" aria-label={`Сейчас ${h}:${m}`}>
          <span>{h}</span>
          <i aria-hidden="true">:</i>
          <span>{m}</span>
        </p>
        <p className="footer__clock-label">
          Закат в {hhmm(evening.sunset)} · {phrase(evening)}
        </p>
      </div>

      <div className="wrap footer__bottom">
        <span>© {new Date().getFullYear()} На вечер</span>
        <span>Аренда вечерних нарядов в Москве</span>
      </div>
    </footer>
  )
}
