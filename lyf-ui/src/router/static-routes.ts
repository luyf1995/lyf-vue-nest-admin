import { RouteRecordRaw } from 'vue-router'

export const staticRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/index',
    meta: {},
    children: [
      {
        path: 'index',
        component: () => import('@/views/index/index.vue'),
        name: 'Index',
        meta: {
          title: '首页',
          icon: 'icon-menu-shouye'
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true,
      noTagRecord: true
    }
  }
]
export const noFoundRoute = {
  path: '/:catchAll(.*)',
  name: '404',
  component: () => import('@/views/404.vue'),
  meta: {
    hidden: true
  }
}
