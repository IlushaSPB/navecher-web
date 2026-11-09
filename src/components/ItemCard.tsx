import { isNew, nb, rub, titleOf, type Item } from '../api'
import Img from './Img'
import HeartIcon from './HeartIcon'

type Props = {
  item: Item
  index: number
  saved: boolean
  onToggleSave: (id: number) => void
  onOpen: (item: Item) => void
}

export default function ItemCard({ item, index, saved, onToggleSave, onOpen }: Props) {
  const [first, second] = item.photos
  const title = titleOf(item)

  return (
    <article className="card" data-reveal style={{ '--d': `${(index % 4) * 80}ms` } as React.CSSProperties}>
      <div className="card__media">
        {first ? (
          <>
            <Img src={first} alt={title} loading="lazy" fallback={<div className="card__placeholder">{item.categoryLabel}</div>} />
            {second && <Img className="card__alt" src={second} alt="" loading="lazy" aria-hidden="true" />}
          </>
        ) : (
          <div className="card__placeholder">{item.categoryLabel}</div>
        )}
        <button
          type="button"
          className={`card__save${saved ? ' is-saved' : ''}`}
          aria-pressed={saved}
          aria-label={saved ? 'Убрать из сохранённого' : 'Сохранить'}
          onClick={() => onToggleSave(item.id)}
        >
          <HeartIcon />
        </button>
      </div>

      <p className="card__meta">
        <span>{isNew(item) ? 'Новое' : item.metro ? `м. ${item.metro}` : item.categoryLabel}</span>
        {item.size && <span className="card__size">{item.size}</span>}
      </p>
      <h3 className="card__title">
        {/* кнопка растянута на всю карточку — клик открывает подробности */}
        <button type="button" className="card__open" onClick={() => onOpen(item)}>
          {nb(title)}
        </button>
      </h3>
      <p className="card__price">
        {rub(item.priceRent)} <em>за вечер</em>
      </p>
    </article>
  )
}
