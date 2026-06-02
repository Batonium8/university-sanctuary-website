import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from "@tailwindcss/vite";
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'swiper/vue': path.resolve(__dirname, 'node_modules/swiper/swiper-vue.mjs'),
      'swiper/modules': path.resolve(__dirname, 'node_modules/swiper/modules/index.mjs'),
      'swiper/css/bundle': path.resolve(__dirname, 'node_modules/swiper/swiper-bundle.css'),
    },
  },
})
