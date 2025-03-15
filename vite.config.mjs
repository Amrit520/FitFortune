import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Force the server to serve new versions of files
    force: true,
    hmr: {
      // Refresh the page when asset files change (like SVGs)
      protocol: 'ws',
      host: 'localhost',
    }
  },
  build: {
    // Add a timestamp to asset filenames to prevent caching
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        chunkFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        assetFileNames: `assets/[name]-[hash]-${Date.now()}.[ext]`,
      },
    },
  },
})
