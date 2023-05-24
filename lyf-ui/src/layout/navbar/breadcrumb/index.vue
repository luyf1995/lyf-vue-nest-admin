<template>
  <div class="breadcrumb-container">
    <lyf-icon
      :icon-class="isCollapsed ? 'icon-zhankai' : 'icon-shousuo'"
      class="collapsed-icon"
      @click="handleCollapsed"
    ></lyf-icon>
    <el-breadcrumb class="breadcrumb" separator="/">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="item.path">
          <span v-if="index == breadcrumbList.length - 1" class="no-redirect">{{ item.meta && item.meta.title }}</span>
          <a v-else @click.prevent="handleLink(item)">{{ item.meta && item.meta.title }}</a>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, watch, reactive, toRefs } from 'vue'

import { useAppStore } from '@/store/index'
import { useRouter, useRoute, RouteRecordRaw } from 'vue-router'

import LyfIcon from '@/components/lyf-icon/index.vue'

export default defineComponent({
  components: {
    LyfIcon
  },
  setup() {
    const appStore = useAppStore()
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      breadcrumbList: [] as RouteRecordRaw[]
    })

    const isCollapsed = computed(() => {
      return appStore.isCollapsed
    })

    watch(route, () => {
      getBreadcrumb()
    })

    /**
     * 左侧菜单折叠/展开
     */
    function handleCollapsed() {
      appStore.setIsCollapsed(!isCollapsed.value)
    }

    /**
     * 获取面包屑
     */
    function getBreadcrumb() {
      const routes = route.matched
      let matched = routes.filter(item => item.meta && item.meta.title)

      state.breadcrumbList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    }
    /**
     * 面包屑点击回调
     * @param {Object} item
     */
    function handleLink(item: RouteRecordRaw) {
      const { path } = item
      router.push(path)
    }
    getBreadcrumb()

    return {
      isCollapsed,
      ...toRefs(state),
      handleCollapsed,
      handleLink
    }
  }
})
</script>
<style scoped lang="scss">
.breadcrumb-container {
  display: flex;
  align-items: center;
  .collapsed-icon {
    font-size: 22px;
    cursor: pointer;
    margin-right: 20px;
  }
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
