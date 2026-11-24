import { http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it } from 'vitest'
import { ApiError, isApiError, NetworkError } from './errors'
import { request } from './http'
import { server } from './mocks/node'
import { tokenStore } from './token'

// ошибка запроса как значение: так удобнее проверять поля
const failure = (path: string) =>
  request(path).then(
    () => null,
    (e: unknown) => e,
  )

describe('http-клиент: ошибки', () => {
  it('новое тело {error, code, fields} — всё переносится в ApiError', async () => {
    server.use(
      http.get('/api/probe', () =>
        HttpResponse.json(
          { error: 'invalid filters', code: 'validation', fields: { date: 'in_past', size: 7 } },
          { status: 400 },
        ),
      ),
    )
    const e = await failure('/api/probe')
    expect(e).toBeInstanceOf(ApiError)
    expect(e).toMatchObject({
      status: 400,
      code: 'validation',
      message: 'invalid filters',
      fields: { date: 'in_past' },
    })
    expect(isApiError(e, 'validation')).toBe(true)
    expect(isApiError(e, 400)).toBe(true)
    expect(isApiError(e, 'not_found')).toBe(false)
  })

  it('старое тело {error} — код берётся из статуса, fields пустые', async () => {
    server.use(http.get('/api/probe', () => HttpResponse.json({ error: 'item not found' }, { status: 404 })))
    expect(await failure('/api/probe')).toMatchObject({
      status: 404,
      code: 'not_found',
      message: 'item not found',
      fields: {},
    })
  })

  it('неизвестный код и не-JSON — по статусу и «HTTP <статус>»', async () => {
    server.use(http.get('/api/probe', () => HttpResponse.json({ error: 'x', code: 'teapot' }, { status: 500 })))
    expect(await failure('/api/probe')).toMatchObject({ code: 'internal', message: 'x' })

    server.use(http.get('/api/probe', () => HttpResponse.text('<html>Bad Gateway</html>', { status: 502 })))
    expect(await failure('/api/probe')).toMatchObject({ status: 502, code: 'unavailable', message: 'HTTP 502' })
  })

  it('обрыв сети — NetworkError', async () => {
    server.use(http.get('/api/probe', () => HttpResponse.error()))
    expect(await failure('/api/probe')).toBeInstanceOf(NetworkError)
  })
})

describe('http-клиент: запрос', () => {
  afterEach(() => tokenStore.clear())

  it('отправляет Bearer-токен и не отправляет пустые параметры', async () => {
    let seen: { auth: string | null; search: string } | null = null
    server.use(
      http.get('/api/probe', ({ request: req }) => {
        seen = { auth: req.headers.get('Authorization'), search: new URL(req.url).search }
        return HttpResponse.json({ ok: true })
      }),
    )
    tokenStore.set('t-1')
    await expect(request('/api/probe', { query: { size: 'S', color: '', date: undefined } })).resolves.toEqual({
      ok: true,
    })
    expect(seen).toEqual({ auth: 'Bearer t-1', search: '?size=S' })
  })

  it('204 — пустой ответ без ошибки', async () => {
    server.use(http.post('/api/probe', () => new HttpResponse(null, { status: 204 })))
    await expect(request('/api/probe', { method: 'POST' })).resolves.toBeUndefined()
  })
})
