import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderRoute } from '@/shared/test'
import { FeedPage } from './FeedPage'

describe('FeedPage', () => {
  it('показывает платья из моков: бренд, название, цену за вечер', async () => {
    renderRoute(<FeedPage />)
    expect(screen.getByLabelText('Загружаем платья')).toBeInTheDocument()

    const grid = await screen.findByRole('list')
    const cards = within(grid).getAllByRole('article')
    expect(cards).toHaveLength(8)
    expect(within(cards[0]).getByText('Платье-бюстье из атласа')).toBeInTheDocument()
    expect(within(cards[0]).getByText('Rasario')).toBeInTheDocument()
    expect(cards[0]).toHaveTextContent('4 500 ₽ / вечер · S')
  })

  it('фильтр из адреса сужает ленту, ссылка на платье его несёт', async () => {
    renderRoute(<FeedPage />, { url: '/?size=XS' })
    const cards = await screen.findAllByRole('article')
    expect(cards).toHaveLength(1)
    expect(within(cards[0]).getByRole('link')).toHaveAttribute('href', '/items/3?size=XS')
  })

  it('ничего не нашлось — предлагает изменить фильтры', async () => {
    renderRoute(<FeedPage />, { url: '/?priceMax=500' })
    expect(await screen.findByText('Ничего не нашлось')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Изменить фильтры' })).toHaveAttribute('href', '/filters?priceMax=500')
  })
})
