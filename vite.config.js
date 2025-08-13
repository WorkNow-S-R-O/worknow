import path from "path"
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  root: "apps/client",
  publicDir: "../../public",
  envDir: "../..", // Load environment variables from root directory
  plugins: [react()],
  server: {
    cors: true,
    port: 3000,
    strictPort: true,
    host: "0.0.0.0",
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "apps/client/src"),
      "libs": path.resolve(__dirname, "libs"),
    },
  },
  optimizeDeps: {
    include: ['zod', '@hookform/resolvers/zod']
  }
})
