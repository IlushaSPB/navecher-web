import { http, HttpResponse } from 'msw'
import type { Session } from '../types'
import { MOCK_TOKEN, MOCK_USER } from './fixtures/user'
import { apiError } from './respond'

// Любой вход выдаёт один и тот же токен; /api/me узнаёт его в заголовке Authorization.
const session = () => HttpResponse.json<Session>({ token: MOCK_TOKEN, user: MOCK_USER })

export const authHandlers = [
  http.get('/api/me', ({ request }) =>
    request.headers.get('Authorization') === `Bearer ${MOCK_TOKEN}`
      ? HttpResponse.json(MOCK_USER)
      : apiError(401, 'unauthorized', 'not signed in'),
  ),
  http.post('/api/auth/dev', session),
  http.post('/api/auth/telegram/widget', session),
  http.post<never, { initData?: string }>('/api/auth/telegram/webapp', async ({ request }) => {
    const { initData } = await request.json()
    return initData ? session() : apiError(401, 'unauthorized', 'bad initData')
  }),
  http.post('/api/auth/logout', () => new HttpResponse(null, { status: 204 })),
]
