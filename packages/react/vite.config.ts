import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  // mode: 'development',
  // optimizeDeps: {
  //   include: ['react-s', 'react-dom-s']
  // },
  // resolve: {
  //   preserveSymlinks: true,
  // },
  // build: {
  //   rollupOptions: {
  //     external: ['react-s', 'react-dom-s'],
  //     output: {
  //       globals: {
  //         react: 'React',
  //         'react-dom': 'ReactDOM'
  //       }
  //     }
  //   }
  // }
})
