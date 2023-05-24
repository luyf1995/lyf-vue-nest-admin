<template>
  <div class="fullscreen-container">
    <lyf-icon v-if="!isFullscreen" icon-class="icon-quanping" class="full-icon" @click="handleFullscreen"></lyf-icon>
    <lyf-icon
      v-if="isFullscreen"
      icon-class="icon-quxiaoquanping"
      class="full-icon"
      @click="handleFullscreen"
    ></lyf-icon>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'

import screenfull from 'screenfull'
import LyfIcon from '@/components/lyf-icon/index.vue'
import { ElMessage } from 'element-plus'

export default defineComponent({
  components: {
    LyfIcon
  },
  setup() {
    const isFullscreen = ref(false)

    /**
     * 全屏/取消全屏
     * @param {Boolean} isFullscreen 是否全屏
     * @return {void}
     */
    function handleFullscreen(): void {
      if (!screenfull.isEnabled) {
        ElMessage({
          message: '浏览器不支持全屏',
          type: 'warning'
        })
      } else {
        screenfull.toggle()
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

    return {
      isFullscreen,
      handleFullscreen
    }
  }
})
</script>
<style scoped lang="scss">
.full-icon {
  font-size: 22px;
  cursor: pointer;
}
</style>
