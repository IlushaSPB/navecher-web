import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { tokenStore } from '@/shared/api'
import { createQueryWrapper } from '@/shared/test'
import { useAuth } from './AuthContext'
import { AuthProvider } from './AuthProvider'

function renderAuth() {
  const Query = createQueryWrapper()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Query>
      <AuthProvider>{children}</AuthProvider>
    </Query>
  )
  return renderHook(() => useAuth(), { wrapper }).result
}

describe('AuthProvider — сессия через кэш [me]', () => {
  it('без токена — аноним, вход для разработки — пользователь, выход — снова аноним', async () => {
    const auth = renderAuth()
    expect(auth.current.status).toBe('loading')
    await waitFor(() => expect(auth.current.status).toBe('anonymous'))

    await act(() => auth.current.loginDev())
    await waitFor(() => expect(auth.current.status).toBe('authenticated'))
    expect(auth.current).toMatchObject({ status: 'authenticated', error: null, user: { firstName: 'Тест' } })
    expect(tokenStore.get()).toBeTruthy()

    await act(() => auth.current.logout())
    await waitFor(() => expect(auth.current.status).toBe('anonymous'))
    expect(auth.current.user).toBeNull()
    expect(tokenStore.get()).toBeNull()
  })

  it('сохранённый токен — сессия восстанавливается по /api/me', async () => {
    tokenStore.set('mock-session-token')
    const auth = renderAuth()
    await waitFor(() => expect(auth.current.status).toBe('authenticated'))
    expect(auth.current.user?.tgId).toBe(1001)
  })

  it('протухший токен — аноним, токен забыт', async () => {
    tokenStore.set('expired')
    const auth = renderAuth()
    await waitFor(() => expect(auth.current.status).toBe('anonymous'))
    expect(tokenStore.get()).toBeNull()
  })
})
