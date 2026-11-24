import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// useGoBack — шаг назад по истории; если экран открыт первым (по ссылке), уходим на fallback.
export function useGoBack(fallback: string) {
  const navigate = useNavigate()
  const { key } = useLocation()
  return useCallback(() => {
    if (key !== 'default') navigate(-1)
    else navigate(fallback, { replace: true })
  }, [key, navigate, fallback])
}
