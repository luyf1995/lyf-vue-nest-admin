export {}

declare module 'vue-router' {
  interface RouteMeta {
    permissions?: Array<string> // 菜单对应的权限
    hidden?: boolean // 是否需要隐藏
    noTagRecord?: boolean // 是否不需要记录页签
  }
}
