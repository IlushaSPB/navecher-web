import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderRoute } from '@/shared/test'
import { ItemPage } from './ItemPage'

const route = { path: '/items/:id' }

describe('ItemPage', () => {
  it('показывает название, цену за вечер, залог и замеры', async () => {
    renderRoute(<ItemPage />, { ...route, url: '/items/1' })
    expect(screen.getByLabelText('Загружаем платье')).toBeInTheDocument()

    expect(await screen.findByRole('heading', { name: 'Платье-бюстье из атласа' })).toBeInTheDocument()
    expect(screen.getByText('4 500 ₽')).toBeInTheDocument()
    expect(screen.getByText('Залог 21 000 ₽')).toBeInTheDocument()
    expect(screen.getByText('Rasario · размер S · надевали 1 раз · сдавали 2 раза')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Выберите дату' })).toBeDisabled()
  })

  it('платья нет — экран «больше нет на витрине»', async () => {
    renderRoute(<ItemPage />, { ...route, url: '/items/999' })
    expect(await screen.findByText(/больше нет на витрине/)).toBeInTheDocument()
  })
})
