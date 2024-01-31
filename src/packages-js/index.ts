import { defineAsyncComponent } from 'vue'

// 获取所有组件，该方法返回一个对象
// @ts-expect-error TS(1343): The 'import.meta' meta-property is only allowed wh... Remove this comment to see the full error message
const components = import.meta.glob('./*/*.vue')
export default {
  install(app: any) {
    // 遍历对象并注册异步组件
    for (const [key, value] of Object.entries(components)) {
      const componentName = capitalizeFirstLetter(key.replace('./', '').split('/')[0].split('-'))
      // @ts-expect-error TS(2345): Argument of type 'unknown' is not assignable to pa... Remove this comment to see the full error message
      app.component(componentName, defineAsyncComponent(value))
    }
  }
}
// 处理注册的组件名
const capitalizeFirstLetter = (arr: any) => {
  return arr.reduce((sum: any, item: any) => {
    return sum + item.charAt(0).toUpperCase() + item.slice(1)
  }, '');
}
