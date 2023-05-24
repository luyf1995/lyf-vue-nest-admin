<template>
  <div class="app-container">
    <div class="sidebar-container" :style="{ width: isCollapsed ? '64px' : '260px' }">
      <div class="sidebar-header">
        <img src="~@/assets/images/icon.gif" alt="" />
        <span v-if="!isCollapsed" class="sidebar-header__title">lyf-admin</span>
      </div>
      <sidebar class="sidebar-main"></sidebar>
    </div>
    <div class="main-container">
      <navbar></navbar>
      <tag-visited></tag-visited>
      <app-main></app-main>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useAppStore } from '@/store/index'

import AppMain from './app-main.vue'
import Sidebar from './sidebar/index.vue'
import Navbar from './navbar/index.vue'
import TagVisited from './tag-visited/index.vue'

export default defineComponent({
  components: {
    AppMain,
    Sidebar,
    Navbar,
    TagVisited
  },
  setup() {
    const appStore = useAppStore()

    // 左侧菜单收缩状态
    const isCollapsed = computed(() => {
      return appStore.isCollapsed
    })

    return {
      isCollapsed
    }
  }
})
</script>
<style scoped lang="scss">
.app-container {
  position: relative;
  width: 100%;
  height: 100%;
  .sidebar-container {
    float: left;
    height: 100%;
    background-color: #001529;
    .sidebar-header {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50px;
      img {
        width: 32px;
        height: 32px;
      }
      &__title {
        font-size: 16px;
        color: #fff;
        margin-left: 10px;
      }
    }
    .sidebar-main {
      height: calc(100% - 50px);
      overflow: auto;
    }
  }
  .main-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
