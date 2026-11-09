import { useEffect, useRef, useState } from 'react'
import { nb, plural, rub, titleOf, type Item } from '../api'
import { lockScroll } from '../smooth'
import { goal } from '../metrics'
import { useSite } from '../site'
import Img from './Img'
import HeartIcon from './HeartIcon'
import Roll from './Roll'

type Props = {
  item: Item | null
  saved: boolean
  onToggleSave: (id: number) => void
  onClose: () => void
}

// ItemSheet — вещь в выезжающей справа панели (нативный <dialog>): фото лентой,
// справа цена, замеры, условия и кнопка в Telegram. На телефоне — на весь экран,
// фото листаются вбок, цена и «Арендовать» прилипают к низу.
export default function ItemSheet({ item, saved, onToggleSave, onClose }: Props) {
  const { notify } = useSite()
  const ref = useRef<HTMLDialogElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [photo, setPhoto] = useState(0)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (item && !d.open) {
      setPhoto(0)
      d.showModal()
      lockScroll(true)
      // Фокус на заголовок, а не на крестик: так при открытии нет рамки фокуса,
      // а скринридер сразу читает название вещи.
      titleRef.current?.focus()
    } else if (!item && d.open) {
      d.close()
    }
  }, [item])

  useEffect(() => () => lockScroll(false), [])

  const close = () => {
    lockScroll(false)
    onClose()
  }

  const title = item ? titleOf(item) : ''
  // без ссылки в бота арендовать нельзя: демо-вещь или бот ещё не подключён
  const why = item?.demo
    ? 'Это демо-вещь. В рабочей версии откроется Telegram: выбираете вечер, владелица подтверждает — и вы получаете её контакт.'
    : 'Бронирование через Telegram скоро заработает. Сохраните вещь, чтобы не потерять.'

  const rent = item && (
    <>
      {item.rentUrl ? (
        <a className="btn btn--block" href={item.rentUrl} target="_blank" rel="noopener" onClick={() => goal('rent_click')}>
          <Roll>Арендовать</Roll>
        </a>
      ) : (
        <button type="button" className="btn btn--block" onClick={() => notify(why)}>
          <Roll>Арендовать</Roll>
        </button>
      )}
      <button
        type="button"
        className={`sheet__save${saved ? ' is-saved' : ''}`}
        aria-pressed={saved}
        aria-label={saved ? 'Убрать из сохранённого' : 'Сохранить'}
        onClick={() => onToggleSave(item.id)}
      >
        <HeartIcon />
      </button>
    </>
  )

  return (
    <dialog ref={ref} className="sheet" aria-label={title} onClose={close} onClick={(e) => e.target === ref.current && close()}>
      {item && (
        <div className="sheet__inner">
          <div className="sheet__media">
            <div
              className="sheet__gallery"
              onScroll={(e) => {
                const g = e.currentTarget
                setPhoto(Math.round(g.scrollLeft / Math.max(1, g.clientWidth)))
              }}
            >
              {item.photos.length > 0 ? (
                item.photos.map((src, i) => (
                  <Img
                    key={src}
                    src={src}
                    alt={i === 0 ? title : ''}
                    fallback={<div className="card__placeholder">{item.categoryLabel}</div>}
                  />
                ))
              ) : (
                <div className="card__placeholder">{item.categoryLabel}</div>
              )}
            </div>
            {item.photos.length > 1 && (
              <span className="sheet__count" aria-hidden="true">
                {photo + 1} / {item.photos.length}
              </span>
            )}
            <button type="button" className="sheet__close-photo" onClick={close} aria-label="Закрыть">
              ×
            </button>
          </div>

          <div className="sheet__info">
            <div className="sheet__top">
              <span className="sheet__kicker">
                {item.categoryLabel}
                {item.size && ` · ${item.size}`}
              </span>
              <button type="button" className="sheet__close" onClick={close} aria-label="Закрыть">
                Закрыть <span aria-hidden="true">×</span>
              </button>
            </div>

            <h2 className="sheet__title" ref={titleRef} tabIndex={-1}>
              {nb(title)}
            </h2>
            <p className="sheet__price">
              {rub(item.priceRent)}
              <span>за вечер, вернуть на следующий день</span>
            </p>
            {item.notes && <p className="sheet__notes">{item.notes}</p>}

            <dl className="sheet__facts">
              {item.size && (
                <div>
                  <dt>Размер</dt>
                  <dd>{item.size}</dd>
                </div>
              )}
              {item.measurements && (
                <div>
                  <dt>Замеры</dt>
                  <dd>{item.measurements}</dd>
                </div>
              )}
              <div>
                <dt>Залог</dt>
                <dd>{item.deposit > 0 ? `${rub(item.deposit)} — вернётся, если вещь в том же состоянии` : 'без залога'}</dd>
              </div>
              {item.priceRetail > 0 && (
                <div>
                  <dt>Цена в магазине</dt>
                  <dd>{rub(item.priceRetail)}</dd>
                </div>
              )}
              {item.metro && (
                <div>
                  <dt>Где забрать</dt>
                  <dd>м. {item.metro}, лучше накануне</dd>
                </div>
              )}
              {item.rentals > 0 && (
                <div>
                  <dt>Сдавали</dt>
                  <dd>
                    {item.rentals} {plural(item.rentals, 'раз', 'раза', 'раз')}
                  </dd>
                </div>
              )}
            </dl>

            <div className="sheet__actions">{rent}</div>

            <p className="sheet__note">
              В Telegram выберете вечер — владелица подтвердит, и вы получите контакт. Оплата и залог — при встрече, без предоплаты.{' '}
              <a href="/rules" className="sheet__link">
                Правила сделки
              </a>
              {' · '}
              {item.reportUrl ? (
                <a href={item.reportUrl} target="_blank" rel="noopener" className="sheet__link">
                  Пожаловаться
                </a>
              ) : (
                <button
                  type="button"
                  className="sheet__link"
                  onClick={() => notify('В рабочей версии жалоба уходит нам в Telegram — отвечаем в течение дня.')}
                >
                  Пожаловаться
                </button>
              )}
            </p>
          </div>

          {/* на телефоне цена и «Арендовать» всегда под пальцем */}
          <div className="sheet__bar">
            <span className="sheet__bar-price">
              {rub(item.priceRent)}
              <span>за вечер</span>
            </span>
            <div className="sheet__actions">{rent}</div>
          </div>
        </div>
      )}
    </dialog>
  )
}
