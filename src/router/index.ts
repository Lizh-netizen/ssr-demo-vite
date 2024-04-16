import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/index' },
  {
    path: '/index',
    name: 'index',
    // @ts-expect-error TS(2307): Cannot find module '../views/index.vue' or its cor... Remove this comment to see the full error message
    component: () => import('../views/index.vue')
  },
  // {
  //   path: '/layout',
  //   name: 'layout',
  //   // @ts-expect-error TS(2307): Cannot find module '../views/ortho/layout.vue' or ... Remove this comment to see the full error message
  //   component: () => import('../views/ortho/layout.vue')
  // },
  {
    path: '/ortho/:appId/:patientId',
    name: 'ortho',
    // @ts-expect-error TS(2307): Cannot find module '../views/ortho/index.vue' or i... Remove this comment to see the full error message
    component: () => import('../views/ortho/index.vue')
  },
  {
    path: '/compareOrtho/:appId/:patientId',
    name: 'compareOrtho',
    // @ts-expect-error TS(2307): Cannot find module '../views/ortho/compare.vue' or... Remove this comment to see the full error message
    component: () => import('../views/ortho/compare.vue')
  },
  {
    path: '/evaluateOrtho/:appId/:patientId/:facialId/:orthStatus?',
    name: 'evaluateOrtho',
    // @ts-expect-error TS(2307): Cannot find module '../views/ortho/evaluate.vue' o... Remove this comment to see the full error message
    component: () => import('../views/ortho/evaluate.vue')
  },
  {
    path: '/evaluatePdf/:appId/:patientId',
    name: 'evaluatePdf',
    // @ts-expect-error TS(2307): Cannot find module '../views/ortho/evaluate.vue' o... Remove this comment to see the full error message
    component: () => import('../views/ortho/evaluatePdf.vue')
  },
  {
    path: '/pdf1/:appId/:patientId',
    name: 'pdf',
    // @ts-expect-error TS(2307): Cannot find module '../views/ortho/pdf1.vue' or it... Remove this comment to see the full error message
    component: () => import('../views/ortho/pdf1.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
