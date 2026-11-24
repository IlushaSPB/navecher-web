import { HttpResponse } from 'msw'
import type { ApiErrorCode } from '../errors'

// apiError — ответ-ошибка в формате API: {"error", "code", "fields"}.
export const apiError = (status: number, code: ApiErrorCode, error: string, fields?: Record<string, string>) =>
  HttpResponse.json({ error, code, ...(fields && { fields }) }, { status })

// readId — числовой id из пути (/api/items/:id); null — в пути не число.
export function readId(raw: string | readonly string[] | undefined): number | null {
  const n = Number(raw)
  return Number.isInteger(n) && n > 0 ? n : null
}
