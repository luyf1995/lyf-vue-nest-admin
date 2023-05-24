<template>
  <template v-if="item.meta && !item.meta.hidden">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item v-if="onlyOneChild.meta" :index="resolvePath(onlyOneChild.path)">
          <i v-if="onlyOneChild.meta.icon || item.meta.icon" class="menu-icon">
            <lyf-icon :icon-class="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"></lyf-icon>
          </i>
          <template #title>
            <item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" :title="onlyOneChild.meta.title" />
          </template>
        </el-menu-item>
      </app-link>
    </template>
    <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.path)" deprecated>
      <template #title>
        <i v-if="item.meta && item.meta.icon" class="menu-icon">
          <lyf-icon :icon-class="item.meta && item.meta.icon"></lyf-icon>
        </i>
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>
  </template>
</template>

<script lang="ts">
import { defineComponent, reactive, toRef, toRefs } from 'vue'

import { isExternal } from '@/utils/validate'
import path from 'path'
import Item from './item.vue'
import AppLink from './link.vue'
import LyfIcon from '@/components/lyf-icon/index.vue'

export default defineComponent({
  name: 'SidebarItem',
  components: {
    Item,
    AppLink,
    LyfIcon
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const { basePath } = toRefs(props)

    let state = reactive({
      onlyOneChild: {} as any
    })

    function hasOneShowingChild(children: Array<any> = [], parent: any) {
      const showingChildren = children.filter(item => {
        if (!item.meta || item.meta.hidden) {
          return false
        } else {
          state.onlyOneChild = item
          return true
        }
      })

      if (showingChildren.length === 1) {
        return true
      }
      if (showingChildren.length === 0) {
        state.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    }
    function resolvePath(routePath: string) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(basePath.value)) {
        return basePath.value
      }
      return path.resolve(basePath.value, routePath)
    }

    return {
      ...toRefs(state),
      hasOneShowingChild,
      resolvePath
    }
  }
})
</script>
<style scoped lang="scss">
.menu-icon {
  font-size: 20px;
  vertical-align: middle;
}
</style>
