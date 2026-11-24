/// <reference types="vitest/config" />
import { rmSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Воркер MSW (public/mockServiceWorker.js) нужен только для npm run dev:mock — в сборку для прода не кладём.
const dropMockWorker = (): Plugin => ({
  name: 'drop-mock-worker',
  apply: 'build',
  closeBundle() {
    rmSync(fileURLToPath(new URL('./dist/mockServiceWorker.js', import.meta.url)), { force: true })
  },
})

// В dev запросы /api уходят на Go-сервер. Порт сервера — HTTP_ADDR в .env;
// если он не 8080, укажи его: API_URL=http://localhost:8787 npm run dev
// npm run dev:mock (--mode mock) — без сервера: ответы подставляет MSW, см. src/shared/api/mocks.
export default defineConfig({
  plugins: [react(), dropMockWorker()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    proxy: {
      '/api': process.env.API_URL ?? 'http://localhost:8080',
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['src/shared/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
