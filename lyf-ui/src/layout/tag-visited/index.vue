<template>
  <div class="tag-visited">
    <el-scrollbar>
      <ul class="tag-list">
        <li
          v-for="(item, index) in tagVisitedList"
          :key="index"
          class="tag-item"
          :class="{ active: isCurrentTag(item.path) }"
          @click="handleLinkTo(item.path)"
        >
          <i v-if="isCurrentTag(item.path)" class="circle-icon"></i>
          <span class="tag-name">{{ item.meta && item.meta.title }}</span>
          <i v-if="tagVisitedList.length > 1" class="close-icon" @click.stop="handleDeleteTagVisited(item)">
            <lyf-icon icon-class="icon-close-bold"></lyf-icon>
          </i>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, watch } from 'vue'
import { useAppStore } from '@/store/index'
import { useRoute, useRouter, RouteLocationNormalizedLoaded } from 'vue-router'

import LyfIcon from '@/components/lyf-icon/index.vue'

export default defineComponent({
  components: {
    LyfIcon
  },
  setup() {
    const appStore = useAppStore()
    const route = useRoute()
    const router = useRouter()

    const tagVisitedList = computed(() => appStore.tagVisitedList)
    // 监听路由的变化，记录页签
    watch(
      route,
      value => {
        hanelAddTagVisited(value)
      },
      {
        immediate: true
      }
    )

    /**
     * 路由跳转
     * @param {String} path
     * @return {void}
     */
    function handleLinkTo(path: string): void {
      if (route.path !== path) {
        router.push(path)
      }
    }
    /**
     * 增加页签
     * @param {Array} tagVisited
     */
    function hanelAddTagVisited(tagVisited: RouteLocationNormalizedLoaded): void {
      if (tagVisited.meta && tagVisited.meta.noTagRecord) {
        return
      }
      appStore.addTagVisited(tagVisited)
    }
    /**
     * 删除页签
     * @param {Array} tagVisited
     */
    function handleDeleteTagVisited(tagVisited: RouteLocationNormalizedLoaded) {
      appStore.deleteTagVisited(tagVisited)

      // 如果删除的是当前激活的active，去自动跳转到最后一个tag

      if (isCurrentTag(tagVisited.path)) {
        router.push(tagVisitedList.value.slice(-1)[0])
      }
    }

    /**
     * 是否是当前路由对应的tag
     * @param {String} path
     * @return {boolean}
     */
    function isCurrentTag(path: string): boolean {
      return route.path === path
    }

    return {
      tagVisitedList,
      handleLinkTo,
      isCurrentTag,
      handleDeleteTagVisited
    }
  }
})
</script>
<style scoped lang="scss">
.tag-visited {
  height: 32px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 0 20px;
  :deep(.el-scrollbar__view) {
    height: 100%;
    .tag-list {
      display: flex;
      align-items: center;
      height: 100%;
      .tag-item {
        display: flex;
        align-items: center;
        border: 1px solid rgba(229, 231, 235);
        padding: 2px 6px;
        height: 25px;
        cursor: pointer;
        color: #4b5563;
        & ~ .tag-item {
          margin-left: 8px;
        }
        &.active {
          background-color: $--color-primary;
          color: #ffffff;
        }
        .circle-icon {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #ffffff;
          margin-right: 5px;
        }
        .tag-name {
          margin-right: 6px;
        }
        .close-icon {
          font-size: 12px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          svg {
            vertical-align: super;
          }
          &:hover {
            background-color: #d1d5db;
            svg {
              color: #ffffff;
            }
          }
        }
      }
    }
  }
}
</style>
