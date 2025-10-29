import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api/rpc': {
        target: 'https://rpc.testnet.sova.io',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/rpc/, ''),
      },
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'wagmi-vendor': ['wagmi', 'viem'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'wagmi', 'viem', 'framer-motion'],
  },
})

