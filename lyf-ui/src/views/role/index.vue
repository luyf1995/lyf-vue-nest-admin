<template>
  <div class="role-container">
    <filter-layout class="filter-container">
      <template #search>
        <el-form :model="searchForm" inline class="search-form">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="searchForm.name" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label="角色标识" prop="code">
            <el-input v-model="searchForm.code" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="fetchRoleList">查询</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template #button>
        <el-button v-permission="['system:role:add']" type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
      </template>
    </filter-layout>
    <lyf-table :columns="columns" :data="tableData" border :max-height="tableHeight"></lyf-table>
    <save-role
      v-model="saveDialogVisible"
      :data="saveDialogData"
      :dialog-type="saveDialogType"
      @success="fetchRoleList"
    ></save-role>
  </div>
</template>
<script setup lang="tsx">
import { ref, nextTick, onMounted, VNode } from 'vue'
import { Search, Plus, Edit, Delete, View } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import LyfTable from '@/components/lyf-table/index.vue'
import FilterLayout from '@/components/page-layout/filter-layout.vue'
import SaveRole from './save-role.vue'

import { IRole, IQueryParams } from '@/api/role/types'
import { getRoleList, deleteRole } from '@/api/role/index'
import { formatDate } from '@/utils/utils'
import { DialogTypeEnum } from '@/api/common/types'
import { hasPermissionShowDOM } from '@/directives/permission/permission'
import { ADMIN_ROLE_ID } from '@/api/common'

const searchForm = ref<IQueryParams>({
  name: '',
  code: ''
})

const tableHeight = ref(400)
const columns = [
  {
    label: '角色名称',
    prop: 'name',
    align: 'center'
  },
  {
    label: '角色标识',
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
    slot: (h: () => VNode, { row }: { row: IRole }) => {
      return <span>{row.createTime && formatDate(new Date(row.createTime), 'yyyy-MM-dd HH:mm:ss')}</span>
    }
  },
  {
    label: '编辑时间',
    prop: 'updateTime',
    align: 'center',
    slot: (h: () => VNode, { row }: { row: IRole }) => {
      return <span>{row.updateTime && formatDate(new Date(row.updateTime), 'yyyy-MM-dd HH:mm:ss')}</span>
    }
  },
  {
    label: '操作',
    width: 220,
    align: 'center',
    fixed: 'right',
    slot: (h: () => VNode, { row }: { row: IRole }) => {
      return (
        <div>
          <el-button
            type="primary"
            link
            icon={View}
            onClick={() => {
              handleViewDetail(row)
            }}
          >
            详情
          </el-button>

          {!isAdminRole(row.id) &&
            hasPermissionShowDOM(
              ['system:role:edit'],
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
          {!isAdminRole(row.id) &&
            hasPermissionShowDOM(
              ['system:role:delete'],
              <el-button type="danger" link icon={Delete} onClick={() => handleDelete(row)} class="danger-btn">
                删除
              </el-button>
            )}
        </div>
      )
    }
  }
]
const tableData = ref<IRole[]>([])

/**
 * 计算表格高度
 */
const computedTableHeight = () => {
  nextTick(() => {
    const container: HTMLDivElement = document.querySelector('.role-container') as HTMLDivElement
    const filterContainer: HTMLDivElement = document.querySelector('.filter-container') as HTMLDivElement
    tableHeight.value = container.offsetHeight - filterContainer.offsetHeight - 10 // 10 margin
  })
}

/**
 * 获取角色列表
 */
const fetchRoleList = () => {
  getRoleList(searchForm.value).then(({ data }) => {
    tableData.value = data || []
  })
}
/**
 * 是否是admin角色
 * @param {string} id
 * @return {boolean}
 */
const isAdminRole = (id: number) => {
  return id === ADMIN_ROLE_ID
}

// 新增、编辑
const saveDialogVisible = ref(false)
const saveDialogData = ref()
const saveDialogType = ref(DialogTypeEnum.ADD)

/**
 * 新增
 */
const handleAdd = () => {
  saveDialogType.value = DialogTypeEnum.ADD
  saveDialogVisible.value = true
}
/**
 * 编辑
 * @param {IRole} role
 */
const handleEdit = (role: IRole) => {
  saveDialogType.value = DialogTypeEnum.EDIT
  saveDialogData.value = role
  saveDialogVisible.value = true
}

/**
 * 删除
 * @param {IRole} role
 */
const handleDelete = (role: IRole) => {
  ElMessageBox.confirm('是否确认删除', '警告', { type: 'warning' })
    .then(() => {
      deleteRole(role.id).then(() => {
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
        fetchRoleList()
      })
    })
    .catch(() => {})
}

/**
 * 查看详情
 * @param {IRole} role
 */
const handleViewDetail = (role: IRole) => {
  saveDialogType.value = DialogTypeEnum.VIEW
  saveDialogData.value = role
  saveDialogVisible.value = true
}
onMounted(() => {
  computedTableHeight()
  fetchRoleList()
})
</script>
<style scoped lang="scss">
.role-container {
  height: 100%;
  .search-form {
    .el-form-item {
      margin-right: 10px;
    }
  }
}
</style>
