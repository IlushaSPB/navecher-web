import { useRef, useState } from 'react'
import { nb, rub, titleOf, type Item } from '../api'
import Img from './Img'

type Props = { items: Item[]; onOpen: (item: Item) => void }

const PREVIEW_W = 240
const PREVIEW_H = 320

// ItemList — каталог строками, как индекс в журнале. На компьютере за курсором
// плывёт фото вещи под строкой; на телефоне фото — миниатюрой в строке.
export default function ItemList({ items, onOpen }: Props) {
  const previewRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)

  const move = (e: React.MouseEvent) => {
    const el = previewRef.current
    if (!el) return
    // держим фото внутри экрана: у правого края — слева от курсора
    const x = e.clientX + 32 + PREVIEW_W > window.innerWidth ? e.clientX - 32 - PREVIEW_W : e.clientX + 32
    const y = Math.min(Math.max(e.clientY - PREVIEW_H / 2, 72), window.innerHeight - PREVIEW_H - 16)
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }

  return (
    <div className="list" onMouseMove={move} onMouseLeave={() => setActive(null)}>
      <div className="list__head" aria-hidden="true">
        <span>Вещь</span>
        <span>Размер</span>
        <span>Метро</span>
        <span>За вечер</span>
      </div>
      {items.map((it) => (
        <button key={it.id} type="button" className="row" onClick={() => onOpen(it)} onMouseEnter={() => setActive(it.id)}>
          <span className="row__thumb">{it.photos[0] && <Img src={it.photos[0]} alt="" loading="lazy" />}</span>
          <span className="row__title">{nb(titleOf(it))}</span>
          <span className="row__size">{it.size || '—'}</span>
          <span className="row__metro">{it.metro ? `м. ${it.metro}` : '—'}</span>
          <span className="row__price">{rub(it.priceRent)}</span>
        </button>
      ))}
      <div ref={previewRef} className={`list__preview${active !== null ? ' is-on' : ''}`} aria-hidden="true">
        {items.map((it) =>
          it.photos[0] ? <img key={it.id} src={it.photos[0]} alt="" className={it.id === active ? 'is-active' : undefined} /> : null,
        )}
      </div>
    </div>
  )
}
