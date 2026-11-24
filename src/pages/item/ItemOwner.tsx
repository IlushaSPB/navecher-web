import { ownerFacts } from '@/entities/item'
import type { ItemOwner as Owner } from '@/shared/api'
import { PersonRow } from '@/shared/ui'
import s from './ItemOwner.module.css'

// ItemOwner — владелица: имя, рейтинг, число аренд, метро.
export function ItemOwner({ owner, metro }: { owner: Owner; metro: string }) {
  return <PersonRow className={s.owner} name={owner.displayName || 'Владелица'} meta={ownerFacts(owner, metro)} />
}
