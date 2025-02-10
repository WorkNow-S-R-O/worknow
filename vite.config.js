import path from "path"
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    cors: true,
    port: 3000
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
