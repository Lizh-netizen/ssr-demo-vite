import { renderToString } from 'vue/server-renderer'
import { createApp } from './main'
import { getAsyncData } from './utils/' // 异步处理数据的时候使用
export async function render(url, ssrManifest) {
  const { app, router, store } = createApp()
  // 找到对应的路由和组件，并且组件会执行服务端请求数据的方法，在server那里注水
  await router.push(url)
  await router.isReady()
  // await getAsyncData(router, store, true)
  // passing SSR context object which will be available via useSSRContext()
  // @vitejs/plugin-vue injects code into a component's setup() that registers
  // itself on ctx.modules. After the render, ctx.modules would contain all the
  // components that have been instantiated during this render call.
  const ctx = {}

  // ctx可以和vue应用和组件通信
  // renderToString会把vue实例转化为字符串
  // html是这个页面渲染出来的，之后会通过替换掉占位符取代
  const html = await renderToString(app, ctx)
  const state = store.state.value
  return { html, state }
}
