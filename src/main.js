import { createSSRApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { createSSRRouter } from './router'
import { ID_INJECTION_KEY } from 'element-plus'
// SSR requires a fresh app instance per request, therefore we export a function
// that creates a fresh app instance. If using Vuex, we'd also be creating a
// fresh store here.
// createSSRApp 在客户端的表现是激活html, 在服务端的表现是创建vue实例
export function createApp() {
  const store = createPinia()
  const router = createSSRRouter()
  const app = createSSRApp(App)
  app.provide(ID_INJECTION_KEY, {
    prefix: 1024,
    current: 0
  })
  app.use(router).use(store)
  return { app, router, store }
}
