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
export function ItemGate({ title, skeleton, children }: ItemGateProps) {
  const { data, loading, error, reload } = useItem(useItemId())
  if (loading) return <>{skeleton}</>
  if (error) return <ItemFallback title={title} onRetry={reload} />
  if (!data) return <ItemFallback title={title} />
  return <>{children(data)}</>
}
