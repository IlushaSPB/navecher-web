import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useConfig } from '@/shared/config'
import { hit, initMetrics } from '@/shared/lib/metrics'

// MetricsTracker — Яндекс Метрика: подключается по номеру из /api/config и считает переходы внутри SPA.
export function MetricsTracker() {
  const id = useConfig().config?.metrikaId ?? ''
  const { pathname, search } = useLocation()

  useEffect(() => {
    if (id) initMetrics(id)
  }, [id])

  useEffect(() => {
    if (id) hit(window.location.href)
  }, [id, pathname, search])

  return null
}
