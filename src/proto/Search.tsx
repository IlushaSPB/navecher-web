import { useMemo, useState } from 'react'
import { plural, SIZES } from '../api'
import Icon from './icons'
import { useProto } from './ctx'
import { Chips, Empty, Seg, Sheet, Tile } from './ui'

type Sort = 'new' | 'cheap' | 'pricey'
type Max = 'any' | '3000' | '5000' | '8000'

// Search — поиск по каталогу: строка, категории и шторка фильтров (размер, цена, порядок).
export default function Search() {
  const { items, cfg, loading } = useProto()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [sizes, setSizes] = useState<string[]>([])
  const [max, setMax] = useState<Max>('any')
  const [sort, setSort] = useState<Sort>('new')
  const [open, setOpen] = useState(false)

  const list = useMemo(() => {
    const text = q.trim().toLowerCase()
    const out = items.filter(
      (it) =>
        (!cat || it.category === cat) &&
        (!sizes.length || sizes.includes(it.size)) &&
        (max === 'any' || it.priceRent <= Number(max)) &&
        (!text || `${it.brand} ${it.categoryLabel} ${it.metro}`.toLowerCase().includes(text)),
    )
    if (sort === 'cheap') out.sort((a, b) => a.priceRent - b.priceRent)
    if (sort === 'pricey') out.sort((a, b) => b.priceRent - a.priceRent)
    return out
  }, [items, q, cat, sizes, max, sort])

  const active = sizes.length + (max !== 'any' ? 1 : 0) + (sort !== 'new' ? 1 : 0)
  // пустые категории не показываем — как на сайте
  const filled = (cfg?.categories ?? []).filter((c) => c.count > 0)
  const cats: [string, string][] = [['', 'Все'], ...(filled.length > 1 ? filled : []).map((c): [string, string] => [c.id, c.label])]

  return (
    <div className="p-screen">
      <div className="p-pad p-search__head">
        <h1 className="p-title">Каталог</h1>
        <div className="p-search">
          <Icon name="search" size={18} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Платье, цвет или метро" aria-label="Поиск" />
          <button type="button" className={`p-search__filters${active ? ' is-on' : ''}`} onClick={() => setOpen(true)} aria-label="Фильтры">
            <Icon name="filters" size={18} />
            {active > 0 && <span className="p-badge">{active}</span>}
          </button>
        </div>
      </div>

      <div className="p-scroll-x">
        <Chips value={cat} options={cats} onChange={setCat} label="Категории" />
      </div>

      <p className="p-pad-x p-count">
        {list.length} {plural(list.length, 'вещь', 'вещи', 'вещей')}
      </p>

      {loading ? (
        <div className="p-grid p-pad-x">
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i} className="p-tile p-skel" />
          ))}
        </div>
      ) : list.length ? (
        <div className="p-grid p-pad-x">
          {list.map((it) => (
            <Tile key={it.id} item={it} />
          ))}
        </div>
      ) : (
        <Empty
          title="Ничего не нашлось"
          text="Попробуйте другой размер или снимите часть фильтров."
          action={
            <button
              type="button"
              className="p-btn p-btn--ghost"
              onClick={() => {
                setQ('')
                setCat('')
                setSizes([])
                setMax('any')
              }}
            >
              Сбросить
            </button>
          }
        />
      )}

      <Sheet open={open} onClose={() => setOpen(false)} title="Фильтры">
        <p className="p-field__label">Размер</p>
        <div className="p-chips p-chips--wrap">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              className="p-chip"
              aria-pressed={sizes.includes(s)}
              onClick={() => setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="p-field__label">Цена за вечер</p>
        <Seg
          value={max}
          onChange={setMax}
          label="Цена за вечер"
          options={[
            ['any', 'Любая'],
            ['3000', 'до 3 000'],
            ['5000', 'до 5 000'],
            ['8000', 'до 8 000'],
          ]}
        />
        <p className="p-field__label">Порядок</p>
        <Seg
          value={sort}
          onChange={setSort}
          label="Порядок"
          options={[
            ['new', 'Новые'],
            ['cheap', 'Дешевле'],
            ['pricey', 'Дороже'],
          ]}
        />
        <button type="button" className="p-btn p-sheet__cta" onClick={() => setOpen(false)}>
          Показать {list.length}
        </button>
      </Sheet>
    </div>
  )
}
