import { API_ERROR_CODES, ApiError, type ApiErrorCode } from './errors'

// Код по статусу — для старых ответов {"error": "..."} без поля code и для чужих страниц ошибок (прокси, nginx).
const STATUS_CODES: Partial<Record<number, ApiErrorCode>> = {
  400: 'bad_request',
  401: 'unauthorized',
  403: 'forbidden',
  404: 'not_found',
  409: 'conflict',
  413: 'too_large',
  422: 'validation',
  502: 'unavailable',
  503: 'unavailable',
  504: 'unavailable',
}

const codeFromStatus = (status: number): ApiErrorCode =>
  STATUS_CODES[status] ?? (status >= 500 ? 'internal' : 'bad_request')

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

const isErrorCode = (v: unknown): v is ApiErrorCode =>
  typeof v === 'string' && (API_ERROR_CODES as readonly string[]).includes(v)

// readFields — {"поле": "причина"}; нестроковые значения отбрасываем.
function readFields(v: unknown): Record<string, string> {
  if (!isRecord(v)) return {}
  return Object.fromEntries(
    Object.entries(v).filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
  )
}

// toApiError — ApiError из ответа не 2xx: новое тело {error, code, fields}, старое {error} или вовсе не JSON.
export function toApiError(status: number, body: unknown): ApiError {
  const data = isRecord(body) ? body : {}
  return new ApiError({
    status,
    code: isErrorCode(data.code) ? data.code : codeFromStatus(status),
    message: typeof data.error === 'string' && data.error ? data.error : `HTTP ${status}`,
    fields: readFields(data.fields),
    body,
  })
}
