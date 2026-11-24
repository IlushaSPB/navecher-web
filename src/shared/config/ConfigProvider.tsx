import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { fetchConfig, type SiteConfig } from '../api'
import { localToday, type IsoDate } from '../lib/date'

type ConfigState = { config: SiteConfig | null; failed: boolean }

const ConfigContext = createContext<ConfigState>({ config: null, failed: false })

// ConfigProvider — настройки сайта из /api/config: имя бота, счётчик, вход для разработки.
export function ConfigProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfigState>({ config: null, failed: false })

  useEffect(() => {
    const ctrl = new AbortController()
    fetchConfig(ctrl.signal)
      .then((config) => setState({ config, failed: false }))
      .catch(() => !ctrl.signal.aborted && setState({ config: null, failed: true }))
    return () => ctrl.abort()
  }, [])

  return <ConfigContext.Provider value={state}>{children}</ConfigContext.Provider>
}

export const useConfig = () => useContext(ConfigContext)

// useToday — сегодня по времени сервиса; пока настройки не пришли — по часам устройства.
export const useToday = (): IsoDate => useConfig().config?.today || localToday()
