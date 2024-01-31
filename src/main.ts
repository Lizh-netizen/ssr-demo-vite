// sessionStorage.setItem(
//   'jc_odos_user',
//   '{"createBy":"平台端添加","createTime":"2023-12-06 12:20:10","updateBy":"lizhanghua","updateTime":"2024-01-17 18:28:28","remark":null,"id":289,"name":"lizhanghua","birth":"2023-12-27","sex":0,"title":null,"email":null,"mobile":"17839228268","isRoot":false,"userId":290,"officeId":231,"officeIdGroup":"230,231,232,233,234,235,236,254,256,265,267,268,269,310,311,319,322,328,330,331","lastOfficeId":231,"status":"0","delFlag":"0","tenantId":"97ad2024-77b9-11ee-9618-b8599f2a8c40","roleIds":null,"password":null,"account":null,"firstLogin":0,"code":null,"userName":"李章华","ljProviderId":4546,"ddUserId":"680631305126411068","detailInformation":null,"speciality":null,"ljOfficeId":171}'
// )
window.parent.postMessage('done', '*')
window.addEventListener('message', receiveMessage, false)
function receiveMessage(event) {
  sessionStorage.setItem('jc_odos_user', event.data)
}

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
// 防止漏掉的try--catch
window.addEventListener('error', (event) => {
  // console.log(event.message, event.filename,event.lineno, event.colno, event.error)
})

// 防止漏掉的PromiseReject
window.addEventListener("unhandledrejection", function (e) {
  // e.reason.stack + e.reason.message上报
  
});
app.use(store)
app.use(router)
app.mount('#app')