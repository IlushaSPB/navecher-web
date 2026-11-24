// Куда вернуть после входа: только свой путь — «//evil.com» и «/\evil.com» браузер понял бы как чужой сайт.
export function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) return '/'
  return raw
}

export const loginPath = (next: string) => `/login?next=${encodeURIComponent(next)}`
