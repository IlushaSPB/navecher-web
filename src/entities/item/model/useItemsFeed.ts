import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query'
import type { ItemPreview, ItemsPage, ItemsQuery } from '@/shared/api'
import { fetchItems } from '../api/api'
import { itemKeys } from '../api/keys'

export const FEED_PAGE_SIZE = 24

const NO_ITEMS: ItemPreview[] = []

// mergePages — склейка страниц без повторов: между запросами лента могла сдвинуться.
export function mergePages(pages: ItemsPage[]): ItemPreview[] {
  const byId = new Map<number, ItemPreview>()
  for (const page of pages) for (const item of page.items) if (!byId.has(item.id)) byId.set(item.id, item)
  return [...byId.values()]
}

// следующая страница — с числа уже показанных; пустая страница — конец, даже если total больше
function nextOffset(last: ItemsPage, pages: ItemsPage[]) {
  const shown = mergePages(pages).length
  return last.items.length > 0 && shown < last.total ? shown : undefined
}

const toFeed = ({ pages }: InfiniteData<ItemsPage, number>) => ({
  items: mergePages(pages),
  total: pages[pages.length - 1]?.total ?? null,
})

// useItemsFeed — лента по страницам: новые фильтры — с начала, loadMore — следующая страница.
// Возврат с карточки платья показывает ленту из кэша сразу, без мигания и с прежней прокруткой.
export function useItemsFeed(query: ItemsQuery) {
  const { data, error, isPending, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } =
    useInfiniteQuery({
      queryKey: itemKeys.list(query),
      queryFn: ({ pageParam, signal }) => fetchItems({ ...query, limit: FEED_PAGE_SIZE, offset: pageParam }, signal),
      initialPageParam: 0,
      getNextPageParam: nextOffset,
      select: toFeed,
    })

  return {
    items: data?.items ?? NO_ITEMS,
    total: data?.total ?? null,
    loading: isPending || isFetchingNextPage,
    // пока идёт повтор, ошибку не показываем — на её месте «Загружаем…»
    error: isFetching ? null : error,
    hasMore: hasNextPage,
    loadMore: () => void fetchNextPage(),
    retry: () => void (data ? fetchNextPage() : refetch()),
  }
}

export type ItemsFeed = ReturnType<typeof useItemsFeed>
