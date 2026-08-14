import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Keep API requests same-origin in local development. Vite forwards /api to
// FastAPI, avoiding browser CORS and localhost/127.0.0.1 mismatches.
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5176,
    strictPort: false,
    proxy: { '/api': { target: 'http://localhost:8001', changeOrigin: true } },
  },
})
