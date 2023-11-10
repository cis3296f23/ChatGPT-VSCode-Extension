import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build:{
    outDir:'../dist',
    assetFileNames: {
      css: `assets/[name].css`,
      js: `js/[name].js`,
      font: `fonts/[name].[ext]`,
      image: `images/[name].[ext]`
    },
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  }
})
