// ApiError — сервер ответил не 2xx. message — текст из {"error": "..."}, если он есть.
export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(status: number, message: string, body: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
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

export const isApiError = (e: unknown, status?: number): e is ApiError =>
  e instanceof ApiError && (status === undefined || e.status === status)
