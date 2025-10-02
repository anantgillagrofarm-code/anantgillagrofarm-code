import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Make assets load with relative paths (important for static deploys)
export default defineConfig({
  base: './',
  plugins: [react()]
})
