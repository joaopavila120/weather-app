import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Mapeia '@' para a pasta src
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
