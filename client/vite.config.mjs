// import { defineConfig } from 'vite';
// import vue from '@vitejs/plugin-vue';
// import { fileURLToPath } from 'url';
// import path from 'path';

// const filename = fileURLToPath(import.meta.url);
// const pathSegments = path.dirname(filename);

// export default defineConfig({
//   plugins: [vue()],
//   server: {
//     host: '127.0.0.1',  // Add this to force IPv4 only
//   },
//   resolve: {
//     alias: {
//       '@': path.resolve(pathSegments, './src'),
//     },
//     extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
//   }
// })

import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: '3000'
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
