import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// server — те же моки для тестов (Vitest, Node). Подключается в src/shared/test/setup.ts.
export const server = setupServer(...handlers)
