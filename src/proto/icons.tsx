// Иконки прототипа — тонкие линии в одном стиле, цвет берут от текста.
const PATHS = {
  home: <path d="M4 10.5 12 4l8 6.5V20h-5.5v-6h-5v6H4z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  bookings: (
    <>
      <path d="M4 5.5h16V20H4z" />
      <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M4.5 20.5c1.2-4 4-6 7.5-6s6.3 2 7.5 6" />
    </>
  ),
  back: <path d="M15 5 8 12l7 7" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  share: (
    <>
      <path d="M12 15V4M8 8l4-4 4 4" />
      <path d="M5 12v8h14v-8" />
    </>
  ),
  send: <path d="M4 12 20 4l-5 16-3.5-6.5zM11.5 13.5 20 4" />,
  filters: (
    <>
      <path d="M4 7h9M19 7h1M4 17h3M13 17h7" />
      <circle cx="16" cy="7" r="2.3" />
      <circle cx="10" cy="17" r="2.3" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  chevron: <path d="m9 5 7 7-7 7" />,
  pin: (
    <>
      <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3.5L9 5.5h6L16.5 8H20v11H4z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  heart: <path d="M12 20.3s-7.3-4.5-7.3-9.9A4.3 4.3 0 0 1 12 7.7a4.3 4.3 0 0 1 7.3 2.7c0 5.4-7.3 9.9-7.3 9.9z" />,
  star: <path d="m12 4 2.4 5 5.4.7-4 3.8 1 5.4-4.8-2.6-4.8 2.6 1-5.4-4-3.8 5.4-.7z" />,
}

export type IconName = keyof typeof PATHS

export default function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  return (
    <svg className="p-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {PATHS[name]}
    </svg>
  )
}
