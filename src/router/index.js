import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router'
console.log(import.meta.env.SSR)
const routes = [
  {
    path: '/',
    name: 'index',
    // @ts-expect-error TS(2307): Cannot find module '../views/index.vue' or its cor... Remove this comment to see the full error message
    component: () => import('../views/index.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/about.vue')
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('../views/user.vue')
  }
]

export function createSSRRouter() {
  return createRouter({
    // import.meta.env.SSR是vite提供环境变量
    // 服务端渲染只能用createMemoryHistory
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes
  })
}
