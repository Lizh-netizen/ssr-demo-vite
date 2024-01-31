import { defineAsyncComponent } from 'vue'

// 获取所有组件，该方法返回一个对象
const components = import.meta.glob('./*/*.vue')
export default {
  install(app) {
    // 遍历对象并注册异步组件
    for (const [key, value] of Object.entries(components)) {
      const componentName = capitalizeFirstLetter(key.replace('./', '').split('/')[0].split('-'))
      app.component(componentName, defineAsyncComponent(value))
    }
  }
}
// 处理注册的组件名
const capitalizeFirstLetter = (arr) => {
  return arr.reduce((sum, item) => {
    return sum + item.charAt(0).toUpperCase() + item.slice(1)
  }, '')
}
