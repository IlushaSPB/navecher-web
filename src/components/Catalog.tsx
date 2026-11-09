import { useEffect, useRef, useState } from 'react'
import { fetchByIds, fetchItem, fetchItems, type Item } from '../api'
import type { useSaved } from '../useSaved'
import { scrollToTarget } from '../smooth'
import { LendLink, useSite } from '../site'
import ItemCard from './ItemCard'
import ItemList from './ItemList'
import ItemSheet from './ItemSheet'
import Lines from './Lines'

type Props = { saved: ReturnType<typeof useSaved> }
type View = 'grid' | 'list'

const PAGE = 12
const SAVED = 'saved'
const VIEW_KEY = 'navecher:view'

function readView(): View {
  try {
    return localStorage.getItem(VIEW_KEY) === 'list' ? 'list' : 'grid'
  } catch {
    return 'grid'
  }
}

// dedupe — без повторов по id: между страницами могла появиться новая вещь и сдвинуть список.
const dedupe = (list: Item[]) => list.filter((it, i) => list.findIndex((x) => x.id === it.id) === i)

export default function Catalog({ saved }: Props) {
  const { cfg } = useSite()
  const [filter, setFilter] = useState('')
  const [size, setSize] = useState('')
  const [view, setView] = useState<View>(readView)
  const [items, setItems] = useState<Item[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [loadingMore, setLoadingMore] = useState(false)
  const [open, setOpen] = useState<Item | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  // поколение фильтра: ответ «Показать ещё» для старого фильтра не должен попасть в новый список
  const generation = useRef(0)

  // Хэш управляет каталогом: #saved — фильтр «Сохранённое» (ссылка в шапке),
  // #item-<id> — открытая вещь (такой ссылкой можно поделиться; «Назад» её закрывает).
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash
      if (hash === '#saved') {
        setFilter(SAVED)
        setSize('')
        if (sectionRef.current) scrollToTarget(sectionRef.current)
      }
      const m = /^#item-(\d+)$/.exec(hash)
      if (!m) {
        setOpen(null)
        return
      }
      fetchItem(Number(m[1]))
        .then((it) => {
          if (it) setOpen(it)
          else history.replaceState(null, '', '#catalog')
        })
        .catch(() => undefined)
    }
    // повторный клик по «Сохранённому», когда в адресе уже #saved: hashchange не придёт
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.('a[href$="#saved"]')
      if (a && window.location.hash === '#saved') sync()
    }
    sync()
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
      document.removeEventListener('click', onClick)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const gen = ++generation.current
    setStatus('loading')
    const load =
      filter === SAVED
        ? fetchByIds(saved.ids).then(({ items, gone }) => {
            if (gone.length) saved.forget(gone)
            return { items, total: items.length }
          })
        : fetchItems(filter, 0, PAGE, size)
    load
      .then((page) => {
        if (cancelled || gen !== generation.current) return
        setItems(page.items)
        setTotal(page.total)
        setStatus('ready')
      })
      .catch(() => !cancelled && setStatus('error'))
    return () => {
      cancelled = true
    }
    // Сохранённое грузим при входе в фильтр; дальше снятые сердечки убираются локально, без мигания.
  }, [filter, size])

  useEffect(() => {
    if (filter === SAVED) setItems((prev) => prev.filter((it) => saved.ids.includes(it.id)))
  }, [filter, saved.ids])

  const loadMore = async () => {
    const gen = generation.current
    setLoadingMore(true)
    try {
      const page = await fetchItems(filter, items.length, PAGE, size)
      if (gen !== generation.current) return
      setItems((prev) => dedupe([...prev, ...page.items]))
      setTotal(page.total)
    } catch {
      /* кнопка останется — можно нажать ещё раз */
    } finally {
      setLoadingMore(false)
    }
  }

  const openItem = (it: Item) => {
    setOpen(it)
    history.pushState({ sheet: true }, '', `#item-${it.id}`)
  }

  const closeItem = () => {
    if (history.state?.sheet)
      history.back() // popstate закроет окно
    else {
      setOpen(null)
      if (window.location.hash.startsWith('#item-')) history.replaceState(null, '', '#catalog')
    }
  }

  const choose = (id: string) => {
    setFilter(id)
    if (window.location.hash === '#saved' && id !== SAVED) {
      history.replaceState(null, '', '#catalog')
    }
  }

  const switchView = (v: View) => {
    setView(v)
    try {
      localStorage.setItem(VIEW_KEY, v)
    } catch {
      /* хранилище недоступно */
    }
  }

  // пустые категории не показываем: «Сумка (0)» только подчёркивает, что вещей мало
  const cats = (cfg?.categories ?? []).filter((c) => c.count > 0)
  const tabs = [{ id: '', label: 'Все' }, ...(cats.length > 1 ? cats : []), { id: SAVED, label: 'Сохранённое' }]
  const sizes = cfg?.sizes ?? []

  return (
    <section className="section catalog" id="catalog" ref={sectionRef}>
      <div className="wrap">
        <div className="sec-head">
          <p className="label" data-reveal>
            (01) Каталог
          </p>
          <h2 className="sec-title" data-reveal="lines">
            <Lines lines={['Свободно', 'на этот вечер']} tail={status === 'ready' && filter !== SAVED && total > 0 && <sup>{total}</sup>} />
          </h2>
        </div>

        <div className="toolbar" data-reveal>
          <div className="filters" role="tablist" aria-label="Категории">
            {tabs.map((t) => (
              <button
                key={t.id || 'all'}
                role="tab"
                aria-selected={filter === t.id}
                className={`filter${filter === t.id ? ' is-active' : ''}`}
                onClick={() => choose(t.id)}
              >
                {t.label}
                {t.id === SAVED && saved.ids.length > 0 && <sup>{saved.ids.length}</sup>}
              </button>
            ))}
          </div>
          <div className="views" role="group" aria-label="Вид каталога">
            <button aria-pressed={view === 'grid'} onClick={() => switchView('grid')}>
              Сетка
            </button>
            <button aria-pressed={view === 'list'} onClick={() => switchView('list')}>
              Список
            </button>
          </div>
        </div>

        {filter !== SAVED && sizes.length > 1 && (
          <div className="sizes" role="group" aria-label="Размер" data-reveal>
            <span className="sizes__label">Размер</span>
            {sizes.map((s) => (
              <button key={s.id} className="size" aria-pressed={size === s.id} onClick={() => setSize(size === s.id ? '' : s.id)}>
                {s.id}
              </button>
            ))}
          </div>
        )}

        {status === 'loading' && (
          <div className="grid" aria-busy="true">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="card card--skeleton">
                <div className="card__media" />
              </div>
            ))}
          </div>
        )}

        {status === 'error' && (
          <div className="empty">
            <p className="empty__title">Каталог не загрузился</p>
            <p>Проверьте соединение и обновите страницу.</p>
          </div>
        )}

        {status === 'ready' &&
          items.length === 0 &&
          (filter === SAVED ? (
            <div className="empty">
              <p className="empty__title">Здесь пока пусто</p>
              <p>Нажмите на сердце на фото — вещь сохранится здесь, даже если закрыть сайт.</p>
            </div>
          ) : (
            <div className="empty">
              <p className="empty__title">{size ? `Размера ${size} пока нет` : 'Первые вещи появятся совсем скоро'}</p>
              <p>Есть платье, которое надето один раз? Выставьте его первой — это пара минут.</p>
              <LendLink className="btn">Сдать вещь</LendLink>
            </div>
          ))}

        {status === 'ready' && items.length > 0 && (
          <>
            {view === 'grid' ? (
              <div className="grid">
                {items.map((it, i) => (
                  <ItemCard key={it.id} item={it} index={i} saved={saved.has(it.id)} onToggleSave={saved.toggle} onOpen={openItem} />
                ))}
              </div>
            ) : (
              <ItemList items={items} onOpen={openItem} />
            )}
            {filter !== SAVED && items.length < total && (
              <button className="more" onClick={loadMore} disabled={loadingMore}>
                <span>{loadingMore ? 'Загружаю…' : 'Показать ещё'}</span>
                <span>
                  {items.length} из {total}
                </span>
              </button>
            )}
          </>
        )}
      </div>

      <ItemSheet item={open} saved={open ? saved.has(open.id) : false} onToggleSave={saved.toggle} onClose={closeItem} />
    </section>
  )
}
