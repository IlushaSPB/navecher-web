import { useLayoutEffect, useRef } from 'react'

// useLatest — ссылка на последнее значение: колбэк для внешних подписок без их пересоздания.
export function useLatest<T>(value: T) {
  const ref = useRef(value)
  useLayoutEffect(() => {
    ref.current = value
  })
  return ref
}
