import type { ReactNode, SVGProps } from 'react'

// Линейные иконки 1.1px, цвет — currentColor. Всегда декоративные: подпись даёт кнопка или текст рядом.
type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'> & { size?: number }

function svg(viewBox: number, defaultSize: number, paths: ReactNode) {
  return function Icon({ size = defaultSize, ...rest }: IconProps) {
    return (
      <svg
        aria-hidden="true"
        focusable="false"
        width={size}
        height={size}
        viewBox={`0 0 ${viewBox} ${viewBox}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.1}
        {...rest}
      >
        {paths}
      </svg>
    )
  }
}

// шапка и действия, 20×20
export const SearchIcon = svg(
  20,
  20,
  <>
    <circle cx="8.5" cy="8.5" r="5.5" />
    <path d="M12.5 12.5L17 17" />
  </>,
)
export const BackIcon = svg(20, 20, <path d="M12.5 4l-6 6 6 6" />)
export const CloseIcon = svg(20, 20, <path d="M4.5 4.5l11 11M15.5 4.5l-11 11" />)
export const InfoIcon = svg(
  20,
  20,
  <>
    <circle cx="10" cy="10" r="7.5" />
    <path d="M10 9v5M10 6.3v.2" />
  </>,
)
export const HeartIcon = svg(20, 20, <path d="M10 17S3 12.5 3 7.8A3.8 3.8 0 0 1 10 5.6 3.8 3.8 0 0 1 17 7.8C17 12.5 10 17 10 17z" />)
export const SettingsIcon = svg(
  20,
  20,
  <>
    <path d="M3 6h14M3 14h14" />
    <circle cx="13" cy="6" r="2" fill="var(--c-ground)" />
    <circle cx="7" cy="14" r="2" fill="var(--c-ground)" />
  </>,
)
export const PlusIcon = svg(20, 20, <path d="M10 3v14M3 10h14" />)
export const ArrowIcon = svg(20, 20, <path d="M3 10h14M12 5l5 5-5 5" />)

// мелкие, 16×16
export const CalendarIcon = svg(16, 16, <path d="M2.5 4.5h11v9h-11zM2.5 7.5h11M5.5 2.5v3M10.5 2.5v3" />)
export const FiltersIcon = svg(
  16,
  16,
  <>
    <path d="M2 4.5h12M2 11.5h12" />
    <circle cx="10" cy="4.5" r="1.6" fill="var(--c-ground)" />
    <circle cx="6" cy="11.5" r="1.6" fill="var(--c-ground)" />
  </>,
)
export const TelegramIcon = svg(16, 16, <path d="M14 2L1.5 7l4.5 1.5L7.5 13 14 2zM6 8.5L14 2" />)
export const CameraIcon = svg(
  16,
  16,
  <>
    <path d="M1.5 4.5h3l1-1.5h5l1 1.5h3v8.5h-13z" />
    <circle cx="8" cy="8.5" r="2.5" />
  </>,
)

// стрелки календаря, 14×14
export const ChevronLeftIcon = svg(14, 14, <path d="M9 2L4 7l5 5" />)
export const ChevronRightIcon = svg(14, 14, <path d="M5 2l5 5-5 5" />)

// нижняя навигация: рисунок 22×22, показ 20×20
export const FeedIcon = svg(22, 20, <path d="M4 3.5h5.5v7H4zM12.5 3.5H18v4h-5.5zM12.5 10.5H18v8h-5.5zM4 13.5h5.5v5H4z" />)
export const FavoritesIcon = svg(22, 20, <path d="M11 18.5S3.5 13.8 3.5 8.7A4 4 0 0 1 11 6.5a4 4 0 0 1 7.5 2.2c0 5.1-7.5 9.8-7.5 9.8z" />)
export const PlaceIcon = svg(22, 20, <path d="M11 4v14M4 11h14" />)
export const ChatsIcon = svg(22, 20, <path d="M3.5 5h15v10.5H9L5 19v-3.5H3.5z" />)
export const ProfileIcon = svg(
  22,
  20,
  <>
    <circle cx="11" cy="7.5" r="3.5" />
    <path d="M4 18.5c.8-3.5 3.6-5 7-5s6.2 1.5 7 5" />
  </>,
)

export type { IconProps }
