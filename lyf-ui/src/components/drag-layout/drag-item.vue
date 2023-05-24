<template>
  <div ref="dragItemRef" class="drag-item" :style="{ width }">
    <slot></slot>
    <!-- 拖拽条 -->
    <div
      v-if="resizeShow"
      class="resize"
      :style="{ width: (dragResizeWidth || dragWrapContext?.dragResizeWidth) + 'px' }"
    ></div>
  </div>
</template>
<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'
import { dragWrapperContextKey } from './utils'

defineOptions({
  name: 'DragItem'
})

const dragWrapContext = inject(dragWrapperContextKey, undefined)

interface IProps {
  width?: string | undefined
  resizeShow?: boolean // 是否显示拖拽条
  dragResizeWidth?: number // 拖拽条的宽度
}

const props = withDefaults(defineProps<IProps>(), {
  width: '200px',
  resizeShow: true,
  dragResizeWidth: 5
})

const dragItemRef = ref(null)
</script>
<style scoped lang="scss">
.drag-item {
  position: relative;
  .resize {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    cursor: col-resize;
    background-color: #d6d6d6;
    z-index: 999;
  }
}
</style>
