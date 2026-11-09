import type { ReactNode } from 'react'
import { nb, rub, titleOf, type Item } from '../api'
import Img from '../components/Img'
import Icon from './icons'
import { useProto } from './ctx'
import { dow, parseIso, slots } from './data'

// TopBar — шапка экрана: назад, заголовок, действия справа. overlay — прозрачная поверх фото.
export function TopBar({ title, onBack, right, overlay }: { title?: string; onBack?: () => void; right?: ReactNode; overlay?: boolean }) {
  return (
    <header className={`p-top${overlay ? ' p-top--overlay' : ''}`}>
      {onBack ? (
        <button type="button" className="p-iconbtn" onClick={onBack} aria-label="Назад">
          <Icon name="back" />
        </button>
      ) : (
        <span />
      )}
      <p className="p-top__title">{title}</p>
      <div className="p-top__right">{right}</div>
    </header>
  )
}

export function SaveBtn({ id, className = '' }: { id: number; className?: string }) {
  const { saved, toast } = useProto()
  const on = saved.has(id)
  return (
    <button
      type="button"
      className={`p-save${on ? ' is-on' : ''} ${className}`}
      aria-pressed={on}
      aria-label={on ? 'Убрать из сохранённого' : 'Сохранить'}
      onClick={() => {
        saved.toggle(id)
        toast(on ? 'Убрано из сохранённого' : 'Сохранено')
      }}
    >
      <Icon name="heart" size={20} />
    </button>
  )
}

export function Photo({ src, alt }: { src?: string; alt: string }) {
  return src ? <Img src={src} alt={alt} loading="lazy" fallback={<span className="p-ph" />} /> : <span className="p-ph" />
}

// Tile — карточка вещи в сетке и в ленте.
export function Tile({ item }: { item: Item }) {
  const { push } = useProto()
  const title = titleOf(item)
  return (
    <article className="p-tile">
      <button type="button" className="p-tile__open" onClick={() => push({ name: 'item', item })}>
        <span className="p-tile__media">
          <Photo src={item.photos[0]} alt={title} />
        </span>
        <span className="p-tile__meta">
          <span>{item.metro ? `м. ${item.metro}` : item.categoryLabel}</span>
          <span>{item.size}</span>
        </span>
        <span className="p-tile__title">{nb(title)}</span>
        <span className="p-tile__price">
          {rub(item.priceRent)} <em>/ вечер</em>
        </span>
      </button>
      <SaveBtn id={item.id} className="p-tile__save" />
    </article>
  )
}

// Row — строка списка: миниатюра, заголовок, подпись и что-то справа.
export function Row({
  photo,
  title,
  meta,
  right,
  onClick,
}: {
  photo?: string
  title: string
  meta: ReactNode
  right?: ReactNode
  onClick: () => void
}) {
  return (
    <button type="button" className="p-row" onClick={onClick}>
      <span className="p-row__thumb">
        <Photo src={photo} alt="" />
      </span>
      <span className="p-row__text">
        <span className="p-row__title">{title}</span>
        <span className="p-row__meta">{meta}</span>
      </span>
      {right && <span className="p-row__right">{right}</span>}
    </button>
  )
}

// Sheet — шторка снизу внутри приложения.
export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null
  return (
    <div className="p-sheet" role="dialog" aria-label={title}>
      <button type="button" className="p-sheet__backdrop" aria-label="Закрыть" onClick={onClose} />
      <div className="p-sheet__panel">
        <span className="p-sheet__handle" aria-hidden="true" />
        <div className="p-sheet__head">
          <p className="p-sheet__title">{title}</p>
          <button type="button" className="p-iconbtn" onClick={onClose} aria-label="Закрыть">
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Seg<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T
  options: [T, string][]
  onChange: (v: T, el: HTMLElement) => void
  label: string
}) {
  return (
    <div className="p-seg" role="group" aria-label={label}>
      {options.map(([v, l]) => (
        <button key={v} type="button" aria-pressed={v === value} onClick={(e) => onChange(v, e.currentTarget)}>
          {l}
        </button>
      ))}
    </div>
  )
}

export function Chips<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T
  options: [T, string][]
  onChange: (v: T) => void
  label: string
}) {
  return (
    <div className="p-chips" role="group" aria-label={label}>
      {options.map(([v, l]) => (
        <button key={v} type="button" className="p-chip" aria-pressed={v === value} onClick={() => onChange(v)}>
          {l}
        </button>
      ))}
    </div>
  )
}

export function Empty({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="p-empty">
      <p className="p-empty__title">{title}</p>
      <p>{text}</p>
      {action}
    </div>
  )
}

// DateStrip — ближайшие вечера вещи; занятые нельзя выбрать.
export function DateStrip({ item, value, onChange }: { item: Item; value: string; onChange: (date: string) => void }) {
  return (
    <div className="p-dates" role="listbox" aria-label="Свободные вечера">
      {slots(item).map((s, i) => {
        const d = parseIso(s.date)
        return (
          <button
            key={s.date}
            type="button"
            role="option"
            aria-selected={value === s.date}
            disabled={s.busy}
            onClick={() => onChange(s.date)}
          >
            <span className="p-dates__dow">{dow(d)}</span>
            <span className="p-dates__num">{d.getDate()}</span>
            <span className="p-dates__note">{s.busy ? 'занято' : i === 0 ? 'сегодня' : ''}</span>
          </button>
        )
      })}
    </div>
  )
}
