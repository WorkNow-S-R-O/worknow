import path from "path"
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite'
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use "." as root if in Docker, otherwise "apps/client"
const isDocker = process.env.DOCKER_BUILD === "true";

// https://vite.dev/config/
export default defineConfig({
  root: isDocker ? "." : "apps/client",
  publicDir: isDocker ? "../public" : "../../public",
  plugins: [react()],
  server: {
    cors: true,
    port: 3000,
    strictPort: false
  },
  proxy: {
    '/api': 'http://localhost:3001',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, isDocker ? "./src" : "client/src"),
      "libs": path.resolve(__dirname, isDocker ? "../../libs" : "libs"),
    },
  },
})
