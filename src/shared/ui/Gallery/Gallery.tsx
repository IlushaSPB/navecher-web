import { useState, type UIEvent } from 'react'
import { cx } from '../../lib/cx'
import { Photo, PhotoStrokes } from '../Photo/Photo'
import s from './Gallery.module.css'

type GalleryProps = {
  photos: string[]
  alt: string // подпись платья; к ней добавляется номер кадра
  className?: string // пропорции галереи
}

// Gallery — фото во всю ширину, листаются свайпом с привязкой к кадру; штрихи показывают текущий.
export function Gallery({ photos, alt, className }: GalleryProps) {
  const [active, setActive] = useState(0)
  const frames = photos.length ? photos : ['']

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    if (el.clientWidth) setActive(Math.round(el.scrollLeft / el.clientWidth))
  }

  return (
    <div className={cx(s.gallery, className)}>
      <div
        className={s.track}
        onScroll={onScroll}
        tabIndex={frames.length > 1 ? 0 : undefined}
        role="region"
        aria-label={`Фото, ${frames.length}`}
      >
        {frames.map((src, i) => (
          <Photo
            key={`${i}-${src}`}
            className={s.slide}
            src={src}
            alt={frames.length > 1 ? `${alt}, фото ${i + 1} из ${frames.length}` : alt}
            eager={i === 0}
          />
        ))}
      </div>
      <PhotoStrokes className={s.strokes} count={frames.length} active={active} tone="dark" size="m" />
    </div>
  )
}
