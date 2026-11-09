import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchConfig, type SiteConfig } from './api'
import { useSaved } from './useSaved'
import { useRevealAll } from './useReveal'
import { useTheme } from './theme'
import { scrollToTarget } from './smooth'
import { initMetrics } from './metrics'
import { Notice, SiteCtx } from './site'
import Header from './components/Header'
import Hero from './components/Hero'
import Catalog from './components/Catalog'
import Statement from './components/Statement'
import HowItWorks from './components/HowItWorks'
import OwnerSection from './components/OwnerSection'
import Faq from './components/Faq'
import Footer from './components/Footer'
import Rules from './components/Rules'

export type Page = 'home' | 'rules'

export default function App({ page }: { page: Page }) {
  const [cfg, setCfg] = useState<SiteConfig | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const noticeTimer = useRef(0)
  const saved = useSaved()
  const { theme, evening, choose } = useTheme()
  useRevealAll()

  useEffect(() => {
    fetchConfig()
      .then((c) => {
        setCfg(c)
        if (c.metrikaId) initMetrics(c.metrikaId)
      })
      .catch(() => setCfg(null))
  }, [])

  const notify = useCallback((text: string) => {
    setNotice(text)
    clearTimeout(noticeTimer.current)
    noticeTimer.current = window.setTimeout(() => setNotice(null), 4200)
  }, [])

  // Ссылки на секции прокручивают плавно и с поправкой на шапку.
  // #item-… и #saved секций не имеют — их обрабатывает каталог.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return
      const a = (e.target as Element).closest?.('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')!.slice(1)
      const target = id === 'top' ? 0 : id && document.getElementById(id)
      if (target === '' || target === null) return
      e.preventDefault()
      scrollToTarget(target)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <SiteCtx.Provider value={{ cfg, notify }}>
      <Header savedCount={saved.ids.length} home={page === 'home'} theme={theme} evening={evening} onTheme={choose} />
      {page === 'home' ? (
        <main>
          <Hero />
          <Catalog saved={saved} />
          <Statement />
          <HowItWorks />
          <OwnerSection />
          <Faq />
        </main>
      ) : (
        <main>
          <Rules />
        </main>
      )}
      <Footer evening={evening} home={page === 'home'} />
      <Notice text={notice} />
    </SiteCtx.Provider>
  )
}
