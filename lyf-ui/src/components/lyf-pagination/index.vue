<template>
  <div class="lyf-pagination">
    <el-pagination
      :style="{ 'justify-content': justifyContent }"
      :current-page="page"
      :page-size="size"
      :page-sizes="pageSizes"
      :layout="layout"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

interface IProps {
  currentPage?: number
  pageSize?: number
  total?: number
  pageSizes?: number[]
  layout?: string
  justifyContent?: string
}
const props = withDefaults(defineProps<IProps>(), {
  currentPage: 1,
  pageSize: 10,
  total: 0,
  pageSizes: () => {
    return [10, 20, 30, 50]
  },
  layout: 'total, sizes, prev, pager, next, jumper',
  justifyContent: 'center'
})

interface IPage {
  currentPage: number
  pageSize: number
}
const emits = defineEmits<{
  (e: 'update:currentPage', currentPage: number): void
  (e: 'update:pageSize', pageSize: number): void
  (e: 'change', data?: IPage): void
}>()

const page = computed({
  get() {
    return props.currentPage
  },
  set(value: number) {
    emits('update:currentPage', value)
  }
})

const size = computed({
  get() {
    return props.pageSize
  },
  set(value: number) {
    emits('update:pageSize', value)
  }
})

/**
 * 每页尺寸改变时触发
 * @param {Number} val
 */
const handleSizeChange = (val: number) => {
  if (page.value * val > props.total) {
    page.value = 1
  }
  emits('update:pageSize', val)
  emits('change', { currentPage: page.value, pageSize: val })
}
/**
 * 页码改变时触发
 * @param {Number} val
 */
const handleCurrentChange = (val: number) => {
  emits('update:currentPage', val)
  emits('change', { currentPage: val, pageSize: size.value })
}
</script>
<style scoped lang="scss"></style>
