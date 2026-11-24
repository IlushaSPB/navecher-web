import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

// startMockWorker — моки в браузере (npm run dev:mock). Шрифты, скрипты и прочее не из /api пропускаем молча,
// а про /api без мока предупреждаем в консоли: значит, пора дописать обработчик.
export const startMockWorker = () =>
  worker.start({
    onUnhandledRequest(request, print) {
      if (new URL(request.url).pathname.startsWith('/api/')) print.warning()
    },
  })
