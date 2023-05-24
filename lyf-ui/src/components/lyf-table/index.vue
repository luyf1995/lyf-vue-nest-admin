<template>
  <el-table ref="elTableRef" :data="tableData">
    <lyf-table-item
      v-for="(item, index) in columns"
      :key="index"
      :item="item"
      @filter-change="data => handleKeywordsFilterChange(data.value, data.prop)"
    ></lyf-table-item>
  </el-table>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'

import LyfTableItem from './lyf-table-item.vue'
import { ElTable } from 'element-plus'

interface IProps {
  data: any[]
  columns: any[]
}

const props = withDefaults(defineProps<IProps>(), {
  data: () => [],
  columns: () => []
})
const filterMap = ref<any>({})

const elTableRef = ref<InstanceType<typeof ElTable>>()

// 根据关键字过滤
const tableData = computed(() => {
  return props.data.filter((item: any) => {
    return Object.keys(filterMap.value).every(key => {
      return String(item[key]).indexOf(filterMap.value[key]) > -1
    })
  })
})

/**
 * 搜索回调
 * @param {String} keywords 搜索关键字
 * @param {String} prop 表格列
 */
function handleKeywordsFilterChange(keywords: string, prop: string): void {
  if (keywords === '' || keywords === undefined || keywords === null) {
    delete filterMap.value[prop]
  } else {
    filterMap.value[prop] = keywords
  }
}

defineExpose({
  elTableRef
})
</script>
<style scoped lang="scss"></style>
