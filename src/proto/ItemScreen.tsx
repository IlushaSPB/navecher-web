import { useState } from 'react'
import { nb, plural, rub, titleOf, type Item } from '../api'
import Img from '../components/Img'
import Icon from './icons'
import { useProto } from './ctx'
import { firstEvening, fmtDay, ownerOf, parseIso } from './data'
import { DateStrip, SaveBtn, TopBar } from './ui'

// ItemScreen — карточка вещи: фото во всю ширину, цена и условия, владелица,
// свободные вечера и кнопка брони внизу.
export default function ItemScreen({ item }: { item: Item }) {
  const { pop, push, toast } = useProto()
  const [date, setDate] = useState(() => firstEvening(item))
  const [photo, setPhoto] = useState(0)
  const [solid, setSolid] = useState(false)
  const owner = ownerOf(item)
  const title = titleOf(item)

  return (
    <div className="p-page p-page--photo">
      <TopBar
        overlay={!solid}
        title={solid ? title : undefined}
        onBack={pop}
        right={
          <>
            <button type="button" className="p-iconbtn" onClick={() => toast('Ссылка скопирована')} aria-label="Поделиться">
              <Icon name="share" />
            </button>
            <SaveBtn id={item.id} className="p-iconbtn" />
          </>
        }
      />

      <div className="p-page__scroll" onScroll={(e) => setSolid(e.currentTarget.scrollTop > e.currentTarget.clientWidth * 1.05)}>
        <div className="p-gallery">
          <div
            className="p-gallery__track"
            onScroll={(e) => setPhoto(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
          >
            {item.photos.map((src, i) => (
              <Img key={src} src={src} alt={i === 0 ? title : ''} />
            ))}
          </div>
          {item.photos.length > 1 && (
            <span className="p-gallery__count label">
              {photo + 1} / {item.photos.length}
            </span>
          )}
        </div>

        <div className="p-item p-pad">
          <p className="p-item__kicker">
            {item.categoryLabel}
            {item.size && ` · ${item.size}`}
          </p>
          <h1 className="p-item__title">{nb(title)}</h1>
          <p className="p-item__price">
            {rub(item.priceRent)}
            <span>за вечер, вернуть на следующий день</span>
          </p>
          {item.notes && <p className="p-item__notes">{item.notes}</p>}

          <dl className="p-facts">
            <div>
              <dt>Размер</dt>
              <dd>{item.size || '—'}</dd>
            </div>
            {item.measurements && (
              <div>
                <dt>Замеры</dt>
                <dd>{item.measurements}</dd>
              </div>
            )}
            <div>
              <dt>Залог</dt>
              <dd>{item.deposit > 0 ? `${rub(item.deposit)}, вернётся при той же вещи` : 'без залога'}</dd>
            </div>
            {item.priceRetail > 0 && (
              <div>
                <dt>Цена в магазине</dt>
                <dd>{rub(item.priceRetail)}</dd>
              </div>
            )}
            <div>
              <dt>Где забрать</dt>
              <dd>{item.metro ? `м. ${item.metro}, лучше накануне` : 'по договорённости'}</dd>
            </div>
            {item.rentals > 0 && (
              <div>
                <dt>Сдавали</dt>
                <dd>
                  {item.rentals} {plural(item.rentals, 'раз', 'раза', 'раз')}
                </dd>
              </div>
            )}
          </dl>

          <div className="p-owner">
            <span className="p-avatar">{owner.name[0]}</span>
            <span className="p-owner__text">
              <span className="p-owner__name">{owner.name}</span>
              <span className="p-owner__meta">
                <Icon name="star" size={11} /> {owner.rating} · сдала {owner.rentals} {plural(owner.rentals, 'раз', 'раза', 'раз')} ·
                отвечает за {owner.reply}
              </span>
            </span>
          </div>

          <p className="p-field__label">Свободные вечера</p>
        </div>
        <DateStrip item={item} value={date} onChange={setDate} />
        <p className="p-note p-pad-x">Оплата и залог — при встрече, без предоплаты. Контакт владелицы — после её подтверждения.</p>
      </div>

      <div className="p-cta">
        <span className="p-cta__sum">
          <span className="p-cta__price">{rub(item.priceRent)}</span>
          <span className="p-cta__date">{fmtDay(parseIso(date))}</span>
        </span>
        <button type="button" className="p-btn" onClick={() => push({ name: 'book', item, date })}>
          Арендовать
        </button>
      </div>
    </div>
  )
}
