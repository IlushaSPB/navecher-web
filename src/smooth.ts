const HEADER = 64

// scrollToTarget — плавно к секции (с поправкой на шапку) или к позиции.
// Прокрутка — родная браузерная: без «инерционных» библиотек, как у SSENSE и Aesop.
export function scrollToTarget(target: HTMLElement | number) {
  const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY - HEADER
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
}

// lockScroll — страница не прокручивается под открытым окном вещи.
export function lockScroll(on: boolean) {
  document.documentElement.classList.toggle('is-locked', on)
}
