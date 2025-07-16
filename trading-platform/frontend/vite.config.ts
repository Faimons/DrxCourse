// C:\Users\DRX_SIMON\Drx-cours2.0\trading-platform\frontend\vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
      host: 'localhost'
    },
    watch: {
      usePolling: true,  // Wichtig für Windows!
      interval: 100
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  css: {
    devSourcemap: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
})