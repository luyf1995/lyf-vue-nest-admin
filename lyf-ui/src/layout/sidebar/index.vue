<template>
  <div class="sidebar">
    <el-menu
      :default-active="activeMenu"
      :unique-opened="false"
      :collapse="isCollapsed"
      :collapse-transition="false"
      background-color="#001529"
      text-color="#ffffff"
      active-text-color="#ffffff"
      mode="vertical"
    >
      <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
    </el-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useAppStore, usePermissionStore } from '@/store/index'
import { useRoute } from 'vue-router'

import SidebarItem from './sidebar-item/index.vue'

export default defineComponent({
  name: 'Sidebar',
  components: {
    SidebarItem
  },
  setup() {
    const appStore = useAppStore()
    const permissionStore = usePermissionStore()
    const route = useRoute()

    // 左侧菜单是否收缩
    const isCollapsed = computed(() => {
      return appStore.isCollapsed
    })

    const routes = computed(() => {
      return permissionStore.routes
    })

    // 当前激活路由
    let activeMenu = computed(() => {
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    })

    return {
      isCollapsed,
      routes,
      activeMenu
    }
  }
})
</script>
<style scoped lang="scss">
.sidebar {
  height: 100%;
  :deep(.el-menu) {
    border-right: none;
  }
  :deep(.el-menu-item) {
    &.is-active {
      background-color: $--color-primary;
    }
  }
}
</style>
