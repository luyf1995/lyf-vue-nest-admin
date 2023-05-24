<template>
  <div class="permission-container">
    <filter-layout class="filter-container">
      <template #search>
        <el-form :model="searchForm" inline class="search-form">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="searchForm.name" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="searchForm.code" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="fetchPermissionList">查询</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template #button>
        <el-button v-permission="['system:permission:add']" type="primary" :icon="Plus" @click="handleAdd"
          >新增</el-button
        >
        <el-button type="info" :icon="Sort" plain @click="handleToggleExpandAll">展开/折叠</el-button>
      </template>
    </filter-layout>
    <lyf-table
      v-if="reRenderTable"
      ref="elTableRef"
      :columns="columns"
      :data="tableData"
      :default-expand-all="isExpandAll"
      :expand-row-keys="expandRowKeys"
      border
      :max-height="tableHeight"
      row-key="id"
    ></lyf-table>
    <save-permission
      v-model="saveDialogVisible"
      :data="saveDialogData"
      :parent-id="saveParentId"
      :dialog-type="saveDialogType"
      :permission-tree="tableData"
      @success="fetchPermissionList"
    ></save-permission>
  </div>
</template>
<script setup lang="tsx">
import { ref, nextTick, onMounted, VNode } from 'vue'
import { Search, Plus, Edit, Delete, Sort } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import LyfTable from '@/components/lyf-table/index.vue'
import FilterLayout from '@/components/page-layout/filter-layout.vue'
import SavePermission from './save-permission.vue'

import { IPermission, IQueryParams } from '@/api/permission/types'
import { getPermissionList, deletePermission } from '@/api/permission/index'
import { formatDate, arrayToTree } from '@/utils/utils'
import { DialogTypeEnum } from '@/api/common/types'
import { hasPermissionShowDOM } from '@/directives/permission/permission'

const searchForm = ref<IQueryParams>({
  name: '',
  code: ''
})

const tableHeight = ref(400)
const columns = [
  {
    label: '权限名称',
    prop: 'name'
  },
  {
    label: '权限标识',
    prop: 'code',
    align: 'center'
  },
  {
    label: '排序',
    prop: 'sort',
    align: 'center',
    width: 100
  },
  {
    label: '创建时间',
    prop: 'createTime',
    align: 'center',
    slot: (h: () => VNode, { row }: { row: IPermission }) => {
      return <span>{row.createTime && formatDate(new Date(row.createTime), 'yyyy-MM-dd HH:mm:ss')}</span>
    }
  },
  {
    label: '编辑时间',
    prop: 'updateTime',
    align: 'center',
    slot: (h: () => VNode, { row }: { row: IPermission }) => {
      return <span>{row.updateTime && formatDate(new Date(row.updateTime), 'yyyy-MM-dd HH:mm:ss')}</span>
    }
  },
  {
    label: '操作',
    width: 220,
    align: 'center',
    fixed: 'right',
    slot: (h: () => VNode, { row }: { row: IPermission }) => {
      return (
        <div>
          {hasPermissionShowDOM(
            ['system:permission:add'],
            <el-button
              type="primary"
              link
              icon={Plus}
              onClick={() => {
                handleAdd(row)
              }}
            >
              新增
            </el-button>
          )}

          {hasPermissionShowDOM(
            ['system:permission:edit'],
            <el-button
              type="primary"
              link
              icon={Edit}
              onClick={() => {
                handleEdit(row)
              }}
            >
              编辑
            </el-button>
          )}
          {hasPermissionShowDOM(
            ['system:permission:delete'],
            <el-button type="danger" link icon={Delete} onClick={() => handleDelete(row)} class="danger-btn">
              删除
            </el-button>
          )}
        </div>
      )
    }
  }
]
const tableData = ref<IPermission[]>([])

/**
 * 计算表格高度
 */
const computedTableHeight = () => {
  nextTick(() => {
    const container: HTMLDivElement = document.querySelector('.permission-container') as HTMLDivElement
    const filterContainer: HTMLDivElement = document.querySelector('.filter-container') as HTMLDivElement
    tableHeight.value = container.offsetHeight - filterContainer.offsetHeight - 10 // 10 margin
  })
}

// 表格展开行
const expandRowKeys = ref<string[]>([])
const reRenderTable = ref(true)
const isExpandAll = ref(false)

/**
 * 设置表格默认展开行
 * @param {array} data
 * @param {number} level 展开层级，默认展开1级
 */
const setTableDefaultExpand = (data = tableData.value, level = 1) => {
  for (let item of data) {
    if (level > 0) {
      expandRowKeys.value.push(item.id + '')
      if (Array.isArray(item.children) && item.children.length > 0) {
        setTableDefaultExpand(item.children, level - 1)
      }
    }
  }
}

/**
 * 展开/折叠
 */
const handleToggleExpandAll = () => {
  isExpandAll.value = !isExpandAll.value
  reRenderTable.value = false
  nextTick(() => {
    reRenderTable.value = true
  })
}

/**
 * 获取部门列表
 */
const fetchPermissionList = () => {
  return getPermissionList(searchForm.value).then(({ data }) => {
    tableData.value = arrayToTree(data || [])
  })
}

// 新增、编辑
const saveDialogVisible = ref(false)
const saveDialogData = ref()
const saveDialogType = ref(DialogTypeEnum.ADD)
const saveParentId = ref()

/**
 * 新增
 * @param {IPermission} permission
 */
const handleAdd = (permission?: IPermission) => {
  if (permission) {
    saveParentId.value = permission.id
  }
  saveDialogType.value = DialogTypeEnum.ADD
  saveDialogVisible.value = true
}
/**
 * 编辑
 * @param {IPermission} permission
 */
const handleEdit = (permission: IPermission) => {
  saveDialogType.value = DialogTypeEnum.EDIT
  saveDialogData.value = permission
  saveDialogVisible.value = true
}

/**
 * 删除
 * @param {IPermission} permission
 */
const handleDelete = (permission: IPermission) => {
  ElMessageBox.confirm('是否确认删除', '警告', { type: 'warning' })
    .then(() => {
      deletePermission(permission.id).then(() => {
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
        fetchPermissionList()
      })
    })
    .catch(() => {})
}

const elTableRef = ref()
onMounted(async () => {
  computedTableHeight()
  await fetchPermissionList()
  setTableDefaultExpand()
})
</script>
<style scoped lang="scss">
.permission-container {
  height: 100%;
  .search-form {
    .el-form-item {
      margin-right: 10px;
    }
  }
}
</style>
