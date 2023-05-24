import { defineStore } from 'pinia'
import { RouteRecordRaw } from 'vue-router'
import { noFoundRoute, staticRoutes } from '@/router/static-routes'
import { asyncRoutes } from '@/router/async-routes'
import { useUserStore } from './index'
import { ADMIN_USER_ID } from '@/api/common'

interface IPermissionState {
  permissions: Array<string>
  routes: Array<RouteRecordRaw>
  addRoutes: Array<RouteRecordRaw>
}

/**
 * 是否有路由的访问权限
 * @param {Array} permissions 权限
 * @param {Object} route 路由
 */
function hasPermission(permissions: Array<string>, route: RouteRecordRaw): boolean {
  if (route.meta && route.meta.permissions) {
    return permissions.some(oItem => route.meta?.permissions?.includes(oItem))
  } else {
    return true
  }
}

/**
 * 通过权限组装可访问路由
 * @param {Array} routes asyncRoutes 异步路由
 * @param {Array} permissions 用户权限
 */
export function filterAsyncRoutes(routes: Array<RouteRecordRaw>, permissions: Array<string>) {
  const res: Array<RouteRecordRaw> = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(permissions, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, permissions)
      }
      res.push(tmp)
    }
  })

  return res
}
const permissionStore = defineStore('permission', {
  state: (): IPermissionState => {
    return {
      permissions: [], // 权限
      routes: [], // 完整路由
      addRoutes: [] // 根据权限匹配的动态路由
    }
  },
  actions: {
    /**
     * 权限
     * @param {Array} permissions
     */
    setPermissions(permissions: Array<string>) {
      this.permissions = permissions
    },
    /**
     * 设置路由
     */
    setRoutes(routes: Array<RouteRecordRaw>) {
      this.addRoutes = routes
      this.routes = [...staticRoutes, ...routes]
      return this.routes
    },
    /**
     * 根据权限生成可访问路由
     */
    generateRoutes() {
      const userStore = useUserStore()
      // 系统管理员跳过权限验证
      const isAdminUser = userStore.userInfo?.id === ADMIN_USER_ID

      const accessRoutes = isAdminUser ? asyncRoutes : filterAsyncRoutes(asyncRoutes, this.permissions)

      accessRoutes.push(noFoundRoute)
      this.setRoutes(accessRoutes)

      return accessRoutes
    }
  }
})

export default permissionStore
