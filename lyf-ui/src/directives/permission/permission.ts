import { DirectiveBinding } from 'vue'

import { useUserStore, usePermissionStore } from '@/store/index'
import { ADMIN_USER_ID } from '@/api/common'

/**
 * 校验权限
 * @param {Array} requiredPerms
 */
export const hasPermission = (requiredPerms: string[]) => {
  const { userInfo } = useUserStore()
  const { permissions } = usePermissionStore()

  // 系统管理员用户
  if (userInfo?.id === ADMIN_USER_ID) {
    return true
  }

  return permissions?.some(perm => {
    return requiredPerms.includes(perm)
  })
}

/**
 * 根据是否有权限来控制元素是否渲染
 * @param {Array} requiredPerms
 * @param {Object} DOM
 */
export const hasPermissionShowDOM = (requiredPerms: string[], DOM: any) => {
  if (hasPermission(requiredPerms)) {
    return DOM
  }
  return
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding
    if (value) {
      const requiredPerms = value

      const hasPerm = hasPermission(requiredPerms)

      if (!hasPerm) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error('权限参数有误！请参考["system:add"]')
    }
  }
}
