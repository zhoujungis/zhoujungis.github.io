/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import imagemin from 'vite-plugin-imagemin'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  test: {
    environment: 'jsdom',
    globals: true,
  },
  base: '/',
  plugins: [
    vue(),
    // 兜底压缩:对 src/ 下未走 prebuild 的图生效
    imagemin({
      gifsicle: { optimizationLevel: 7 },
      mozjpeg: { quality: 75 },
      pngquant: { quality: [0.65, 0.8] },
      svgo: {
        plugins: [
          { name: 'removeViewBox' },
          { name: 'removeEmptyAttrs', active: false },
        ],
      },
      webp: { quality: 80 },
      avif: { quality: 60 },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // 让 china-geo.json 等大资产走 contenthash 强缓存
        assetFileNames: 'assets/[name].[hash][extname]',
        manualChunks(id) {
          if (id.includes('node_modules/echarts')) return 'echarts'
          if (id.includes('node_modules/highlight.js')) return 'highlight'
          if (id.includes('node_modules/vditor')) return 'vditor'
        },
      },
    },
  },
}))
