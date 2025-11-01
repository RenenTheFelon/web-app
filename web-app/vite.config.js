import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allows Vite to be accessed externally (like Replit)
    port: 5000,
    allowedHosts: [
      '.replit.dev', // allow all Replit preview hosts
    ],
    hmr: {
      clientPort: 5000,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
