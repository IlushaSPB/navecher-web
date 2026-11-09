import { useState, type ImgHTMLAttributes } from 'react'

// Img плавно проявляет картинку после загрузки; при ошибке показывает fallback.
type Props = ImgHTMLAttributes<HTMLImageElement> & { fallback?: React.ReactNode }

export default function Img({ className = '', fallback = null, onLoad, onError, ...rest }: Props) {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading')
  if (state === 'error') return <>{fallback}</>
  return (
    <img
      {...rest}
      className={`${className} img${state === 'loaded' ? ' is-loaded' : ''}`}
      onLoad={(e) => {
        setState('loaded')
        onLoad?.(e)
      }}
      onError={(e) => {
        setState('error')
        onError?.(e)
      }}
    />
  )
}
