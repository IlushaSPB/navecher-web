import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// В dev запросы /api уходят на Go-сервер. Порт сервера — HTTP_ADDR в .env;
// если он не 8080, укажи его: API_URL=http://localhost:8787 npm run dev
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': process.env.API_URL ?? 'http://localhost:8080',
    },
  },
})
