// Коды ошибок API. Тело ошибки: {"error": "текст", "code": "<snake_case>", "fields": {"поле": "причина"}}.
export const API_ERROR_CODES = [
  'bad_request',
  'validation',
  'unauthorized',
  'forbidden',
  'not_found',
  'conflict',
  'too_large',
  'unavailable',
  'internal',
] as const

export type ApiErrorCode = (typeof API_ERROR_CODES)[number]

export type ApiErrorInit = {
  status: number
  code: ApiErrorCode
  message: string
  fields?: Record<string, string>
  body?: unknown
}

// ApiError — сервер ответил не 2xx. fields — причины по полям формы (для code === 'validation').
export class ApiError extends Error {
  readonly status: number
  readonly code: ApiErrorCode
  readonly fields: Readonly<Record<string, string>>
  readonly body: unknown

  constructor({ status, code, message, fields = {}, body }: ApiErrorInit) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.fields = fields
    this.body = body
  }
}

// NetworkError — до сервера не дошли: нет сети, CORS, обрыв.
export class NetworkError extends Error {
  readonly reason: unknown

  constructor(reason: unknown) {
    super('network error')
    this.name = 'NetworkError'
    this.reason = reason
  }
}

// isApiError — ошибка API; второй аргумент сужает проверку по статусу (404) или коду ('not_found').
export const isApiError = (e: unknown, match?: number | ApiErrorCode): e is ApiError =>
  e instanceof ApiError && (match === undefined || (typeof match === 'number' ? e.status : e.code) === match)
