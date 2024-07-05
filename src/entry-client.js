import { createApp } from './main'
// 客户端做的是 从脱水
const { app, router, store } = createApp()
if (typeof window !== 'undefined' && window.__INIT_STATE__) {
  // 当使⽤ template 时， context.state 将作为 window.__INIT_STATE__ 状态⾃动嵌⼊到最终的 HTML
  // 在客户端挂载到应⽤程序之前， store 就应该获取到状态：
  store.state.value = JSON.parse(JSON.stringify(window.__INIT_STATE__))
}
export { app, router, store }
router.isReady().then(() => {
  app.mount('#app')
})
