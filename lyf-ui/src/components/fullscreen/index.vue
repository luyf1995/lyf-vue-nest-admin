<template>
  <div class="fullscreen-container">
    <lyf-icon
      v-if="!isFullscreen"
      icon-class="icon-quanping"
      class="full-icon"
      title="全屏"
      @click="handleFullscreen"
    ></lyf-icon>
    <lyf-icon
      v-if="isFullscreen"
      icon-class="icon-quxiaoquanping"
      class="full-icon"
      title="取消全屏"
      @click="handleFullscreen"
    ></lyf-icon>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

import screenfull from 'screenfull'
import LyfIcon from '@/components/lyf-icon/index.vue'
import { ElMessage } from 'element-plus'

interface IProps {
  elementSelector?: string
}
const props = withDefaults(defineProps<IProps>(), {
  elementSelector: ''
})

const isFullscreen = ref<boolean>(false)

/**
 * 全屏/取消全屏
 * @return {void}
 */
function handleFullscreen(): void {
  if (!screenfull.isEnabled) {
    ElMessage({
      message: '浏览器不支持全屏',
      type: 'warning'
    })
  } else {
    const elementSelector = props.elementSelector
    const element = (elementSelector ? document.querySelector(elementSelector) : document.documentElement) as Element
    screenfull.toggle(element)
  }
}

/**
 * 全屏/取消全屏change回调
 * @return {void}
 */
function fullscreenChange(): void {
  if (screenfull.isEnabled) {
    isFullscreen.value = screenfull.isFullscreen
  }
}
onMounted(() => screenfull.isEnabled && screenfull.on('change', fullscreenChange))
onUnmounted(() => screenfull.isEnabled && screenfull.off('change', fullscreenChange))
</script>
<style scoped lang="scss">
.full-icon {
  font-size: 22px;
  cursor: pointer;
}
</style>
