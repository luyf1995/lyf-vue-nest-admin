<template>
  <div class="dept-container">
    <el-input v-model="searchDept" :prefix-icon="Search" placeholder="部门名称"></el-input>
    <el-tag v-if="selectedDept?.id" class="selected-dept" closable @close="handleDelete">
      {{ selectedDept.name }}
    </el-tag>
    <el-tree
      ref="elTreeRef"
      :data="deptTree"
      :props="{ label: 'name' }"
      node-key="id"
      default-expand-all
      highlight-current
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      class="dept-tree"
      @node-click="handleNodeClick"
    ></el-tree>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { ElTree } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

import { getDeptList } from '@/api/dept/index'
import { arrayToTree } from '@/utils/utils'
import { IDeptTree } from '@/api/dept/types'

const emits = defineEmits<{
  (e: 'change', dept: IDeptTree | null): void
}>()

const searchDept = ref('')

watch(searchDept, value => {
  elTreeRef.value?.filter(value)
})
/**
 * 节点过滤
 * @param {string} value
 * @param {IDeptTree} data
 */
const filterNode = (value: string, data: IDeptTree) => {
  if (!value) return true
  return data.name.includes(value)
}

const elTreeRef = ref<InstanceType<typeof ElTree>>()
const deptTree = ref<IDeptTree[]>([])
/**
 * 获取部门树
 */
const getDeptTree = () => {
  getDeptList().then(({ data }) => {
    deptTree.value = arrayToTree(data || [])
  })
}
const selectedDept = ref<IDeptTree | null>()

/**
 * 树节点点击回调
 */
const handleNodeClick = (data: IDeptTree) => {
  selectedDept.value = data
  emits('change', selectedDept.value)
}

/**
 * 删除选中项
 */
const handleDelete = () => {
  selectedDept.value = null
  elTreeRef.value?.setCurrentKey()
  emits('change', null)
}

onMounted(() => {
  getDeptTree()
})
</script>
<style scoped lang="scss">
.dept-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  .selected-dept {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
  }
}
</style>
