import { Directive, DirectiveBinding } from 'vue'

import { useUserStore } from '@/store/index'

const hasRole: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { userInfo } = useUserStore()
    // 后续可能一个用户有多个角色可以配置
    const roleCodes = (userInfo?.roles || []).map(item => item.code)
    const { value } = binding
    if (value) {
      const requiredRoles = value
      const hasRole = roleCodes?.some(perm => {
        return requiredRoles.includes(perm)
      })
      if (!hasRole) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error('角色参数有误！请参考["admin"]')
    }
  }
}
export default hasRole
