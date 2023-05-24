<template>
  <div ref="dragWrapperRef" class="drag-wrapper">
    <slot :drag-resize-width="dragResizeWidth"></slot>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, provide, reactive, toRefs, getCurrentInstance } from 'vue'
import { dragWrapperContextKey } from './utils'

defineOptions({
  name: 'DragWrapper'
})

interface IProps {
  minWidth?: number
  dragResizeWidth?: number // 拖拽条的宽度
}

const props = withDefaults(defineProps<IProps>(), {
  minWidth: 200, // 拖拽盒子最小宽度
  dragResizeWidth: 10
})

const emits = defineEmits<{
  (e: 'dragging'): void
  (e: 'drag-end'): void
}>()

provide(
  dragWrapperContextKey,
  reactive({
    ...toRefs(props)
  })
)

const dragWrapperRef = ref<HTMLDivElement | null>(null)

// 如果dragItem 没有定义宽度，则flex=1
const setDragItemFlex = () => {
  const childLength = dragWrapperRef.value!.children.length

  for (let i = 0; i < childLength; i++) {
    const node = dragWrapperRef.value!.children[i] as HTMLDivElement
    if (!node.style.width) {
      // 如果没有定义宽度，则flex=1
      node.style.flex = '1'
    }
  }
}

/**
 * 给所有drag-item绑定事件
 */
const dragControllerDiv = () => {
  const resize = document.getElementsByClassName('resize') // 拖拽条
  // 循环为每个拖拽条添加事件
  for (let i = 0; i < resize.length; i++) {
    // 鼠标按下事件
    resize[i].addEventListener('mousedown', onMouseDown)
  }
}

// 当前拖拽项
let dragItem: HTMLElement | null = null
// 当前拖拽条
let dragResize: HTMLElement | null = null
// 当前拖拽项的下一个兄弟拖拽项
let dragNextItem: HTMLElement | null = null
// 当前拖拽项的下一个兄弟拖拽项内的拖动条
let dragNextResize: HTMLElement | null = null
// 当前拖拽项可视宽度
let dragItemWidth: number
// 除了当前拖拽项和下一个兄弟拖拽项，剩余拖拽项的宽度和
let otherDragItemWidth: number
// 开始拖拽点的x坐标
let dragStartX: number

/**
 * 鼠标按下事件
 * @param {Event} e
 */
const onMouseDown = (e: any) => {
  dragResize = e.target as HTMLElement
  // 当前拖拽项
  dragItem = dragResize.parentNode as HTMLElement
  // 当前拖拽项的下个兄弟节点
  dragNextItem = getNextElement(dragItem) as HTMLElement
  // 当前拖拽项的下个兄弟节点内的拖拽条
  dragNextResize = dragNextItem.getElementsByClassName('resize')[0] as HTMLElement

  if (!dragNextItem) return

  dragItemWidth = dragItem.clientWidth // 当前拖拽项宽度
  otherDragItemWidth = dragWrapperRef.value!.clientWidth - dragItemWidth - dragNextItem.clientWidth

  // 颜色改变提醒
  dragResize.style.background = '#818181'
  dragStartX = e.clientX

  document.addEventListener('mousemove', onMousemove)
  document.addEventListener('mouseup', onMouseup)
}

/**
 * 鼠标移动事件
 */
const onMousemove = (e: any) => {
  const dragEndX = e.clientX
  // 拖拽距离
  const dragLength = dragEndX - dragStartX
  // 拖拽后的item宽度
  const afterDragItemWidth = dragItemWidth + dragLength
  // 当前拖拽项的下一个兄弟拖拽项宽度
  const afterDrageNextItemWidth = dragWrapperRef.value!.clientWidth - afterDragItemWidth - otherDragItemWidth

  if (afterDragItemWidth <= props.minWidth || afterDrageNextItemWidth <= props.minWidth) return

  // 设置拖动后盒子宽度
  dragItem!.style.width = afterDragItemWidth + 'px'

  // 设置拖动后resize的left
  dragResize!.style.left = afterDragItemWidth - dragResize!.clientWidth + 'px'
  // 设置拖动盒子右侧盒子的宽度
  dragNextItem!.style.width = afterDrageNextItemWidth + 'px'
  dragNextResize && (dragNextResize!.style.left = afterDrageNextItemWidth - dragNextResize!.clientWidth + 'px')

  emits('dragging')
}
/**
 * 鼠标松开事件
 */
const onMouseup = (e: any) => {
  dragResize!.style.background = '#d6d6d6'
  document.removeEventListener('mousemove', onMousemove)
  document.removeEventListener('mouseup', onMouseup)

  emits('drag-end')
}

/**
 * 获取下一个兄弟元素
 */
const getNextElement = (element: HTMLElement) => {
  if (element.nextElementSibling) {
    return element.nextElementSibling
  } else {
    var next = element.nextSibling
    while (next && next.nodeType !== 1) {
      next = next.nextSibling
    }
    return next
  }
}

onMounted(() => {
  setDragItemFlex()
  dragControllerDiv()
})
</script>
<style scoped lang="scss">
.drag-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
}
</style>
