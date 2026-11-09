import { useRef, useState } from 'react'
import { DEPOSIT_RATES, num, RENT_RATES, round100, rub, SIZES } from '../api'
import Img from '../components/Img'
import Icon from './icons'
import { useProto } from './ctx'
import { METRO, shrinkPhoto, type MyItem } from './data'
import { Chips } from './ui'

const STEPS = ['Фото', 'Что это', 'Цена', 'Где забрать', 'Проверка']
const MAX_PHOTOS = 5 // как в боте
const FALLBACK_CATS = [{ id: 'dress', label: 'Платье', count: 0 }]
const EVENINGS = 2 // для примера: честный ориентир на первый сезон

// Lend — «Сдать вещь» за пять шагов: фото, что это, цена (подсказки как в боте),
// где забрать и проверка карточки. Вещь попадает в «Мои вещи».
export default function Lend() {
  const { cfg, pop, replace, addMine } = useProto()
  const cats = cfg?.categories ?? FALLBACK_CATS
  const fileRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState(0)
  const [photos, setPhotos] = useState<string[]>([])
  const [cat, setCat] = useState(cats[0].id)
  const [title, setTitle] = useState('')
  const [size, setSize] = useState('S')
  const [measure, setMeasure] = useState('')
  const [notes, setNotes] = useState('')
  const [retail, setRetail] = useState(30_000)
  const [rate, setRate] = useState(15)
  const [dep, setDep] = useState<number>(DEPOSIT_RATES[0]) // 0 — без залога
  const [metro, setMetro] = useState('')
  const [courier, setCourier] = useState(true)
  const [done, setDone] = useState<MyItem | null>(null)

  const rent = round100((retail * rate) / 100)
  const deposit = round100((retail * dep) / 100)
  const catLabel = cats.find((c) => c.id === cat)?.label ?? ''
  const name = title.trim() || catLabel
  const hints = metro.trim() ? METRO.filter((m) => m.toLowerCase().includes(metro.trim().toLowerCase()) && m !== metro).slice(0, 4) : []
  const ready = [photos.length > 0, title.trim().length > 1, retail >= 1_000, metro.trim().length > 1, true][step]

  const addFiles = async (files: FileList | null) => {
    if (!files) return
    const room = MAX_PHOTOS - photos.length
    const list = await Promise.all([...files].slice(0, room).map((f) => shrinkPhoto(f).catch(() => '')))
    setPhotos((prev) => [...prev, ...list.filter(Boolean)].slice(0, MAX_PHOTOS))
  }

  const publish = () => {
    const m: MyItem = {
      id: `m${Date.now()}`,
      title: name,
      categoryLabel: catLabel,
      size,
      measurements: measure.trim(),
      notes: notes.trim(),
      priceRetail: retail,
      priceRent: rent,
      deposit,
      metro: metro.trim(),
      photo: photos[0],
      rentals: 0,
      earned: 0,
      paused: false,
    }
    addMine(m)
    setDone(m)
  }

  if (done) {
    return (
      <div className="p-page p-done">
        <svg className="p-done__check" viewBox="0 0 52 52" aria-hidden="true">
          <circle cx="26" cy="26" r="24" />
          <path d="m15 27 7.5 7.5L38 19" />
        </svg>
        <p className="label">Готово</p>
        <h1 className="p-done__title">Вещь опубликована</h1>
        <p className="p-note">
          «{done.title}» уже в каталоге и уйдёт в канал. Запросы придут в «Брони → Я сдаю» — вы сами решаете, кому сдать.
        </p>
        <div className="p-done__actions">
          <button type="button" className="p-btn p-btn--block" onClick={() => replace({ name: 'mine' })}>
            К моим вещам
          </button>
          <button type="button" className="p-btn p-btn--ghost p-btn--block" onClick={pop}>
            Готово
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-page">
      <header className="p-top">
        <button type="button" className="p-iconbtn" onClick={step ? () => setStep(step - 1) : pop} aria-label={step ? 'Назад' : 'Закрыть'}>
          <Icon name={step ? 'back' : 'close'} />
        </button>
        <p className="p-top__title">Сдать вещь</p>
        <span className="label p-top__right">
          {step + 1} / {STEPS.length}
        </span>
      </header>
      <div className="p-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${(step + 1) / STEPS.length})` }} />
      </div>

      <div className="p-page__scroll p-pad p-lend" key={step}>
        <p className="label">
          Шаг {step + 1} — {STEPS[step]}
        </p>

        {step === 0 && (
          <>
            <h1 className="p-lend__title">Сфотографируйте вещь</h1>
            <p className="p-note">Целиком на вешалке или на себе, при дневном свете. До {MAX_PHOTOS} фото — первое станет обложкой.</p>
            <div className="p-photos">
              {photos.map((src, i) => (
                <span key={i} className="p-photos__item">
                  <img src={src} alt={`Фото ${i + 1}`} />
                  {i === 0 && <span className="label p-photos__cover">Обложка</span>}
                  <button
                    type="button"
                    className="p-photos__remove"
                    aria-label="Убрать фото"
                    onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))}
                  >
                    <Icon name="close" size={14} />
                  </button>
                </span>
              ))}
              {photos.length < MAX_PHOTOS && (
                <button type="button" className="p-photos__add" onClick={() => fileRef.current?.click()}>
                  <Icon name="camera" size={26} />
                  <span className="label">Добавить</span>
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => addFiles(e.target.files)} />
            {photos.length === 0 && (
              <button type="button" className="p-link label p-lend__sample" onClick={() => setPhotos(['/editorial/closet.jpg'])}>
                Нет фото под рукой — взять пример
              </button>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="p-lend__title">Что это за вещь?</h1>
            <p className="p-field__label">Категория</p>
            <Chips value={cat} onChange={setCat} label="Категория" options={cats.map((c): [string, string] => [c.id, c.label])} />
            <p className="p-field__label">Название</p>
            <input
              className="p-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: чёрное платье-комбинация"
              aria-label="Название"
            />
            <p className="p-field__label">Размер</p>
            <Chips value={size} onChange={setSize} label="Размер" options={SIZES.map((s): [string, string] => [s, s])} />
            <p className="p-field__label">Замеры и ваш рост — первое, что спрашивают</p>
            <input
              className="p-field"
              value={measure}
              onChange={(e) => setMeasure(e.target.value)}
              placeholder="86-64-92, рост 168"
              aria-label="Замеры и рост"
            />
            <p className="p-field__label">Сколько раз надевали, нюансы</p>
            <input
              className="p-field"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Надевала один раз, без дефектов"
              aria-label="Описание"
            />
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="p-lend__title">Сколько стоит вечер?</h1>
            <p className="p-field__label">Цена в магазине</p>
            <label className="p-money">
              <input
                inputMode="numeric"
                value={num.format(retail)}
                onChange={(e) => setRetail(Math.min(1_000_000, Number(e.target.value.replace(/\D/g, '')) || 0))}
                aria-label="Цена в магазине"
              />
              <span>₽</span>
            </label>
            <p className="p-field__label">Аренда за вечер — обычно 10–15% цены</p>
            <div className="p-options">
              {RENT_RATES.map((r) => (
                <button key={r} type="button" aria-pressed={rate === r} onClick={() => setRate(r)}>
                  <span className="label">{r}%</span>
                  <span>{rub(round100((retail * r) / 100))}</span>
                </button>
              ))}
            </div>
            <p className="p-field__label">Залог — примерно цена перепродажи, так он защищает</p>
            <div className="p-options">
              {[...DEPOSIT_RATES, 0].map((d) => (
                <button key={d} type="button" aria-pressed={dep === d} onClick={() => setDep(d)}>
                  <span className="label">{d === 0 ? 'Без' : `${d}%`}</span>
                  <span>{d === 0 ? 'залога' : rub(round100((retail * d) / 100))}</span>
                </button>
              ))}
            </div>
            <p className="p-lend__earn">
              Например, {EVENINGS} вечера — <b>{rub(rent * EVENINGS)}</b>
            </p>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="p-lend__title">Где удобно передать?</h1>
            <p className="p-field__label">Станция метро</p>
            <input
              className="p-field"
              value={metro}
              onChange={(e) => setMetro(e.target.value)}
              placeholder="Начните вводить"
              aria-label="Метро"
            />
            {hints.length > 0 && (
              <div className="p-hints">
                {hints.map((h) => (
                  <button key={h} type="button" onClick={() => setMetro(h)}>
                    <Icon name="pin" size={16} /> {h}
                  </button>
                ))}
              </div>
            )}
            <label className="p-toggle-row">
              <span>
                Курьер — для тех, с кем уже встречалась
                <span className="p-note">В первый раз — только личная встреча, так спокойнее</span>
              </span>
              <input type="checkbox" className="p-toggle" checked={courier} onChange={(e) => setCourier(e.target.checked)} />
            </label>
          </>
        )}

        {step === 4 && (
          <>
            <h1 className="p-lend__title">Так увидят вашу вещь</h1>
            <div className="p-preview">
              <span className="p-preview__media">
                <Img src={photos[0]} alt="" />
              </span>
              <span className="p-tile__meta">
                <span>{measure.trim() || catLabel}</span>
                <span>{size}</span>
              </span>
              <span className="p-preview__title">{name}</span>
              <span className="p-tile__price">
                {rub(rent)} <em>/ вечер</em>
              </span>
            </div>
            <dl className="p-facts">
              <div>
                <dt>Цена в магазине</dt>
                <dd>{rub(retail)}</dd>
              </div>
              <div>
                <dt>Залог</dt>
                <dd>{deposit ? rub(deposit) : 'без залога'}</dd>
              </div>
              <div>
                <dt>Где забрать</dt>
                <dd>
                  м. {metro.trim()}
                  {courier && ' или курьер'}
                </dd>
              </div>
            </dl>
            <p className="p-note">Размещение бесплатное — вся сумма аренды ваша.</p>
          </>
        )}
      </div>

      <div className="p-cta">
        <button
          type="button"
          className="p-btn p-btn--block"
          disabled={!ready}
          onClick={() => (step < STEPS.length - 1 ? setStep(step + 1) : publish())}
        >
          {step < STEPS.length - 1 ? 'Дальше' : 'Опубликовать'}
        </button>
      </div>
    </div>
  )
}
