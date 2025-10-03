// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',        // <- important: makes asset paths relative (./assets/...)
  plugins: [react()]
})
