import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/index' },
  {
    path: '/index',
    name: 'index',
    component: () => import('../views/index.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../views/test.vue')
  },
  {
    path: '/ortho/:appId/:patientId',
    name: 'ortho',
    component: () => import('../views/ortho/index.vue')
  },
  {
    path: '/compareOrtho/:appId/:patientId',
    name: 'compareOrtho',
    component: () => import('../views/ortho/compare.vue')
  },
  {
    path: '/evaluateOrtho/:appId/:patientId',
    name: 'evaluateOrtho',
    component: () => import('../views/ortho/evaluate.vue')
  },
  {
    path: '/list',
    name: 'list',
    component: () => import('../views/list.vue')
  },
  {
    path: '/pdf1/:appId/:patientId',
    name: 'pdf',
    component: () => import('../views/ortho/pdf1.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
