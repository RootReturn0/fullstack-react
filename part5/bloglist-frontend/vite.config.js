import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const BASE_URL = 'http://localhost'
const PORT = process.env.PORT || 3003

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: `${BASE_URL}:${PORT}`,
        changeOrigin: true,
      },
    }
  },
})
