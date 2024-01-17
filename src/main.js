import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/main.css'
import { ElMessage } from 'element-plus'
import lazyPlugin from 'vue3-lazy'
// 注册svg矢量图
import 'virtual:svg-icons-register'
// 全局样式
import './global.scss'
import './packages-js/index.scss'
import imgPlaceholder from './assets/ortho/lazyImg.png'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
app.use(lazyPlugin, {
  loading: imgPlaceholder,
  error: 'error.png'
})
app.config.globalProperties.axiosPromiseArr = []

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
window.parent.postMessage('done', '*')
  window.addEventListener('message', receiveMessage, false)
function receiveMessage (event) {
console.log(event.data,new Date().getTime())
  sessionStorage.setItem('jc_odos_user', event.data)
  }
// 测试officeId
console.log('测试')
app.use(store)
app.use(router)
app.mount('#app')
