import { defineStore } from 'pinia'
import { RouteLocationNormalized } from 'vue-router'
import { deepClone } from '@/utils/utils'

interface IAppState {
  isCollapsed: boolean
  tagVisitedList: Array<RouteLocationNormalized>
}

const appStore = defineStore('app', {
  state: (): IAppState => {
    return {
      isCollapsed: false, // 系统左侧菜单是否收缩
      tagVisitedList: [] // 页签集合
    }
  },
  actions: {
    setIsCollapsed(isCollapsed: boolean) {
      this.isCollapsed = isCollapsed
    },
    addTagVisited(tagVisited: RouteLocationNormalized) {
      if (this.tagVisitedList.some((tag: RouteLocationNormalized) => tag.path === tagVisited.path)) {
        return
      }
      this.tagVisitedList.push(
        deepClone({
          path: tagVisited.path,
          fullPath: tagVisited.fullPath,
          name: tagVisited.name,
          meta: tagVisited.meta,
          params: tagVisited.params,
          query: tagVisited.query
        })
      )
    },
    deleteTagVisited(tagVisited: RouteLocationNormalized) {
      this.tagVisitedList = this.tagVisitedList.filter((tag: RouteLocationNormalized) => tag.path !== tagVisited.path)
    }
  }
})

export default appStore
