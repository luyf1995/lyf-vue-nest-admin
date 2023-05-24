<template>
  <span>{{ column.label }}</span>
  <el-popover ref="filterPopoverRef" placement="bottom" :width="200" trigger="click">
    <template #reference>
      <lyf-icon
        icon-class="icon-search"
        class="filter-icon"
        :class="{ active: confirmFilterKeywords }"
        @click.stop
      ></lyf-icon>
    </template>
    <div class="filter-body">
      <slot name="filterPopover">
        <el-input v-model="filterKeywords"></el-input>
        <div class="filter-btn">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </slot>
    </div>
  </el-popover>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import LyfIcon from '@/components/lyf-icon/index.vue'

interface IProps {
  column: any
}
const props = withDefaults(defineProps<IProps>(), {
  column: () => {
    return {}
  }
})

const emits = defineEmits<{
  (e: 'filter-popover-change', data: string): void
}>()

let filterPopoverRef = ref()

const filterKeywords = ref<string>('')
const confirmFilterKeywords = ref<string>('')

/**
 * 搜索
 * @return {void}
 */
const handleSearch = () => {
  confirmFilterKeywords.value = filterKeywords.value
  emits('filter-popover-change', confirmFilterKeywords.value)
  filterPopoverRef.value.hide()
}
/**
 * 重置
 * @return {void}
 */
const handleReset = () => {
  filterKeywords.value = ''
  handleSearch()
}
</script>
<style scoped lang="scss">
.filter-btn {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  .el-button {
    padding: 8px 24px;
  }
}
.filter-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
  &.active {
    color: $--color-primary;
  }
}
</style>
