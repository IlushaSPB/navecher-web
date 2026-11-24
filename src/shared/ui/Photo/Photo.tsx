import { useState } from 'react'
import { cx } from '@/shared/lib/cx'
import s from './Photo.module.css'

type PhotoProps = {
  src: string // пусто — только пудровая подложка
  alt: string
  eager?: boolean // первый кадр экрана грузим сразу
  className?: string // размеры и пропорции задаёт место использования
}

// Photo — снимок платья на пудровой подложке; битое или пустое фото оставляет подложку.
export function Photo({ src, alt, eager, className }: PhotoProps) {
  const [brokenSrc, setBrokenSrc] = useState<string | null>(null)
  return (
    <div className={cx(s.frame, className)}>
      {src && brokenSrc !== src && (
        <img
          className={s.img}
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          onError={() => setBrokenSrc(src)}
        />
      )}
    </div>
  )
}

type PhotoStrokesProps = {
  count: number
  active: number
  tone: 'light' | 'dark' // светлые штрихи — на карточке, тёмные — в галерее платья
  size?: 's' | 'm'
  className?: string
}

// PhotoStrokes — штрихи 1px: сколько у платья фото и какое сейчас на экране.
export function PhotoStrokes({ count, active, tone, size = 's', className }: PhotoStrokesProps) {
  if (count < 2) return null
  return (
    <span className={cx(s.strokes, s[tone], s[size], className)} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={cx(s.stroke, i === active && s.current)} />
      ))}
    </span>
  )
}
