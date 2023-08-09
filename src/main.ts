import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import { Lazyload } from 'vant'
import PinInput from 'v-pin-input'
import routes from './router'
import '@vant/touch-emulator';
import 'vant/lib/index.css'
import './assets/css/normalize.scss'
//@ts-ignore
import App from './App.tsx'


const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

if (import.meta.env.MODE === 'production') {
  const meta = document.createElement('meta')
  meta.setAttribute('http-equiv', 'Content-Security-Policy')
  meta.setAttribute('content', 'upgrade-insecure-requests')

  document.head.insertBefore(meta, document.querySelector('link[rel=icon]') || null)
}


createApp(App)
  .use(Lazyload, {
    lazyComponent: true
  })
  .use(PinInput)
  .use(router)
  .use(createPinia())
  .mount('#app')
