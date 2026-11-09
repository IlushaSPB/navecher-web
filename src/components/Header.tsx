import { useRef } from 'react'
import { hhmm, type Evening } from '../sun'
import type { Theme } from '../theme'
import { LendLink, useSite } from '../site'
import HeartIcon from './HeartIcon'

type Props = {
  savedCount: number
  home: boolean // на главной ссылки — якоря, на других страницах ведут на главную
  theme: Theme
  evening: Evening
  onTheme: (t: Theme, origin?: HTMLElement | null) => void
}

// Header — прозрачная шапка. Цвет задаёт главный экран через data-hero на <html>:
// paper — над бумагой, veil — фото уже под шапкой, но ещё не на весь экран, image — над фото,
// past — главный экран пролистан, шапка на фоне.
export default function Header({ savedCount, home, theme, evening, onTheme }: Props) {
  const { cfg } = useSite()
  const base = home ? '' : '/'

  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__brand">
          <a href={home ? '#top' : '/'} className="header__logo" aria-label="На вечер — на главную">
            На вечер
          </a>
          {cfg?.demo && (
            <span className="header__demo" title="Демо-версия: в каталоге примеры вещей для показа">
              Демо
            </span>
          )}
        </div>
        <nav className="header__nav" aria-label="Разделы">
          <a href={`${base}#catalog`}>Каталог</a>
          <a href={`${base}#how`}>Как это устроено</a>
          <a href={`${base}#owners`}>Владелицам</a>
          <a href="/rules">Правила</a>
        </nav>
        <div className="header__side">
          <ThemeSwitch theme={theme} evening={evening} onTheme={onTheme} />
          <a href={`${base}#saved`} className="header__saved" aria-label={`Сохранённое: ${savedCount}`}>
            <HeartIcon />
            <span className="header__saved-text">Сохранённое</span>
            {savedCount > 0 && <sup>{savedCount}</sup>}
          </a>
          <LendLink className="header__cta">Сдать вещь</LendLink>
        </div>
      </div>
    </header>
  )
}

// ThemeSwitch — московское время и переключатель «День / Вечер».
// После заката сайт сам становится вечерним; ручной выбор это перекрывает.
function ThemeSwitch({ theme, evening, onTheme }: Pick<Props, 'theme' | 'evening' | 'onTheme'>) {
  const ref = useRef<HTMLButtonElement>(null)
  const night = theme === 'night'

  return (
    <button
      ref={ref}
      type="button"
      className={`switch${night ? ' is-night' : ''}`}
      onClick={() => onTheme(night ? 'day' : 'night', ref.current)}
      aria-label={night ? 'Включить дневной режим' : 'Включить вечерний режим'}
      title={`Закат в Москве сегодня в ${hhmm(evening.sunset)} — после него сайт сам становится вечерним`}
    >
      <span className="switch__time">{hhmm(evening.now)}</span>
      <span className="switch__track" aria-hidden="true">
        <span className="switch__knob" />
      </span>
      <span className="switch__label">{night ? 'Вечер' : 'День'}</span>
    </button>
  )
}
