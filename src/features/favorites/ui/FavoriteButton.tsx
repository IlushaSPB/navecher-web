import { cx } from '@/shared/lib/cx'
import { HeartIcon, IconButton } from '@/shared/ui'
import { useFavorite } from '../model/useFavorites'
import s from './FavoriteButton.module.css'

type FavoriteButtonProps = { id: number; iconSize?: number; className?: string }

// FavoriteButton — сердце: контур или ягодная заливка, если платье сохранено.
export function FavoriteButton({ id, iconSize = 20, className }: FavoriteButtonProps) {
  const [saved, toggle] = useFavorite(id)
  return (
    <IconButton label="Сохранить" aria-pressed={saved} className={cx(saved && s.saved, className)} onClick={toggle}>
      <HeartIcon size={iconSize} fill={saved ? 'currentColor' : 'none'} />
    </IconButton>
  )
}
