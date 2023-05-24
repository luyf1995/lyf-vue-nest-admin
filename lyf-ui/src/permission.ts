import { ElMessage } from 'element-plus'
import { RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import router from '@/router/index'
import pinia, { useUserStore, usePermissionStore } from '@/store/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/get-page-title'
import { awaitTo } from './utils/utils'

const userStore = useUserStore(pinia)
const permissionStore = usePermissionStore(pinia)

NProgress.configure({ showSpinner: false })

// 不需要登录就可以访问的白名单页面
const whiteList = ['/login']

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  // debugger
  NProgress.start()
  // 设置页面标题
  document.title = getPageTitle(to.meta.title as string)

  // 用户token
  if (userStore.token) {
    if (to.path === '/login') {
      // next({ path: '/' })
      userStore.logoutByFrontEnd()
      next()
      NProgress.done()
    } else {
      if (userStore.userInfo) {
        next()
      } else {
        const [error, userInfo] = await awaitTo(userStore.getUserInfo())
        if (error) {
          ElMessage.error(error)
        } else {
          permissionStore.setPermissions(userInfo.permissions || {})
          const accessRoutes = permissionStore.generateRoutes()

          accessRoutes.forEach(item => {
            router.addRoute(item)
          })
          if (to.path === '/') {
            next(redirectToFirstRoute(accessRoutes))
          } else {
            next({ ...to, replace: true })
          }
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      // 白名单
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

/**
 * 重定向到可访问的第一个路由
 * @return {*}
 */
const redirectToFirstRoute = (accessRoutes: RouteRecordRaw[]) => {
  let redirectTo: RouteRecordRaw | string = '/'
  for (let item of accessRoutes) {
    if (!item.meta?.hidden) {
      // 暂时最多只考虑二层级的路由
      if (item.children && item.children.length > 0) {
        redirectTo = item.children[0]
      } else {
        redirectTo = item
      }
      break
    }
  }
  return redirectTo
}
