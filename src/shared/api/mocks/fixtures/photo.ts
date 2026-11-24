// placeholderPhoto — SVG-заглушка вместо снимка: силуэт платья цвета вещи на светлом фоне.
// Картинка встроена в адрес (data:), поэтому работает без сети — и в браузере, и в тестах.
const BACKGROUNDS = ['#ece7df', '#e4ddd2', '#f2eee8'] as const

const DRESS = 'M128 70h12l6 46h28l6-46h12l4 84c20 60 44 150 52 214H72c8-64 32-154 52-214z'

export function placeholderPhoto(hex: string, frame = 0): string {
  const bg = BACKGROUNDS[frame % BACKGROUNDS.length]
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">` +
    `<rect width="300" height="400" fill="${bg}"/><path d="${DRESS}" fill="${hex}"/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
