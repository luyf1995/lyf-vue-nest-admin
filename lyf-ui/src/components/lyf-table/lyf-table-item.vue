<!-- eslint-disable vue/valid-v-slot -->
<template>
  <el-table-column v-bind="item">
    <!-- 自定义表头 -->
    <template v-if="typeof item.slotHeader === 'function' || item.keywordsFilter" #header="{ column, $index }">
      <slot-render
        v-if="typeof item.slotHeader === 'function'"
        :render="item.slotHeader"
        :scope="{ column, $index }"
      ></slot-render>
      <!-- 表头关键字搜索 -->
      <keywords-filter
        v-else-if="item.keywordsFilter"
        :column="item"
        @filter-popover-change="
          value =>
            emits('filterChange', {
              value,
              prop: item.prop
            })
        "
      ></keywords-filter>
    </template>

    <!-- 自定义单元格内容 -->
    <template v-if="typeof item.slot === 'function'" #default="{ row, column, $index }">
      <slot-render :render="item.slot" :scope="{ row, column, $index }"></slot-render>
    </template>

    <!-- 多级表头 -->
    <template v-if="Array.isArray(item.children) && item.children.length > 0" #default>
      <lyf-table-item v-for="(tableItem, index) in item.children" :key="index" :item="tableItem"></lyf-table-item>
    </template>
  </el-table-column>
</template>
<script lang="ts" setup>
import SlotRender from './slot-render.vue'
import KeywordsFilter from './keywords-filter.vue'

interface IProps {
  item: any // 表格项配置
}
const props = withDefaults(defineProps<IProps>(), {
  item: {}
})
const emits = defineEmits<{
  (e: 'filterChange', data: { value: string; prop: string }): void
}>()
</script>
