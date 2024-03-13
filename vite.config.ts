import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // vue(),
    vueJsx(), 
    Components({
      resolvers: [VantResolver()],
    })
  ],
  server: {
    host: '0.0.0.0',
    proxy: {
      // 带选项写法：http://localhost:5173/api/bar -> http://jsonplaceholder.typicode.com/bar
      '/api': {
        target: 'http://test-api.bangumi.xyz:4000/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  },
  build: {
    // @ts-ignore
    outDir: process.env.NODE_ENV === 'production' ? 'dist/prod' : 'dist/test',
  }
})
