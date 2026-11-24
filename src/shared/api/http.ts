import { ApiError, NetworkError } from './errors'
import { tokenStore } from './token'

type Query = Record<string, string | number | undefined>

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  query?: Query
  signal?: AbortSignal
}

type HttpDeps = { getToken: () => string | null }

// Пустые значения в query не отправляем: category= и size= сервер понимает как «все».
function withQuery(path: string, query?: Query) {
  if (!query) return path
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(query)) if (v !== undefined && v !== '') q.set(k, String(v))
  const s = q.toString()
  return s ? `${path}?${s}` : path
}

async function readBody(res: Response): Promise<unknown> {
  if (res.status === 204) return undefined
  const text = await res.text()
  if (!text) return undefined
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

const errorText = (body: unknown, status: number) =>
  body && typeof body === 'object' && 'error' in body && typeof body.error === 'string' ? body.error : `HTTP ${status}`

// createHttpClient — JSON поверх fetch: cookie сессии, Bearer-токен, типизированные ошибки.
export function createHttpClient({ getToken }: HttpDeps) {
  return async function request<T>(path: string, { method = 'GET', body, query, signal }: RequestOptions = {}): Promise<T> {
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (body !== undefined) headers['Content-Type'] = 'application/json'
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`

    let res: Response
    try {
      res = await fetch(withQuery(path, query), {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        credentials: 'include',
        signal,
      })
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') throw e
      throw new NetworkError(e)
    }

    const data = await readBody(res)
    if (!res.ok) throw new ApiError(res.status, errorText(data, res.status), data)
    return data as T
  }
}

export const request = createHttpClient({ getToken: tokenStore.get })
