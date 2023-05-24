import { RouteRecordRaw } from 'vue-router'

export const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: '/system',
    name: 'system',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: '系统管理',
      icon: 'icon-menu-xitong',
      permissions: ['system:user', 'system:dept', 'system:role', 'system:permission']
    },
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'icon-menu-yonghu',
          permissions: ['system:user']
        }
      },
      {
        path: 'dept',
        name: 'dept',
        component: () => import('@/views/dept/index.vue'),
        meta: {
          title: '部门管理',
          icon: 'icon-menu-bumen',
          permissions: ['system:dept']
        }
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/role/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'icon-menu-jiaose',
          permissions: ['system:role']
        }
      },
      {
        path: 'permission',
        name: 'permission',
        component: () => import('@/views/permission/index.vue'),
        meta: {
          title: '权限管理',
          icon: 'icon-menu-quanxian',
          permissions: ['system:permission']
        }
      }
    ]
  }
]
