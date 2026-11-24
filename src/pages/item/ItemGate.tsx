import type { ReactNode } from 'react'
import { useItem } from '@/entities/item'
import type { Item } from '@/shared/api'
import { ItemFallback } from './ItemFallback'
import { useItemId } from './useItemId'

type ItemGateProps = {
  title: string // шапка экрана ошибки
  skeleton: ReactNode
  children(item: Item): ReactNode
}

// ItemGate — грузит платье из адреса и показывает экран, только когда оно есть.
export function ItemGate({ title, ...rest }: ItemGateProps) {
  const id = useItemId()
  if (id === null) return <ItemFallback title={title} />
  return <ItemLoader id={id} title={title} {...rest} />
}

function ItemLoader({ id, title, skeleton, children }: ItemGateProps & { id: number }) {
  const { data, isPending, error, refetch } = useItem(id)
  if (isPending) return <>{skeleton}</>
  if (error) return <ItemFallback title={title} onRetry={() => void refetch()} />
  if (!data) return <ItemFallback title={title} />
  return <>{children(data)}</>
}
