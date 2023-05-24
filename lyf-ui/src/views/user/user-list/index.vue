<template>
  <div v-resize="computedTableHeight" class="user-list-container">
    <filter-layout class="filter-container">
      <template #search>
        <el-form :model="searchForm" inline class="search-form">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="searchForm.username" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="nickname">
            <el-input v-model="searchForm.nickname" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="searchForm.status" placeholder="请选择" clearable>
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色" prop="roleId">
            <el-select v-model="searchForm.roleId" placeholder="请选择" clearable>
              <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template #button>
        <el-button v-permission="['system:user:add']" type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
      </template>
    </filter-layout>
    <lyf-table :columns="columns" :data="tableData" border :max-height="tableHeight"></lyf-table>
    <lyf-pagination
      v-model:current-page="searchForm.pageNum"
      v-model:page-size="searchForm.pageSize"
      :total="total"
      class="pagination-container"
      @change="getTableData"
    ></lyf-pagination>
    <save-user
      v-model="saveDialogVisible"
      :data="saveDialogData"
      :dialog-type="saveDialogType"
      @success="getTableData"
    ></save-user>
    <reset-password v-model="resetPwdDialogVisible" :data="resetPwdDialogData" @success="getTableData"></reset-password>
  </div>
</template>
<script setup lang="tsx">
import { ref, nextTick, onMounted, watch, VNode } from 'vue'
import { Search, Plus, Edit, Delete, RefreshLeft } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import LyfTable from '@/components/lyf-table/index.vue'
import FilterLayout from '@/components/page-layout/filter-layout.vue'
import LyfPagination from '@/components/lyf-pagination/index.vue'
import SaveUser from './save-user.vue'
import ResetPassword from './reset-password.vue'

import { IUser, IQueryParams, StatusEnum } from '@/api/user/types'
import { getUserList, deleteUser, changeStatus } from '@/api/user/index'
import { getRoleList } from '@/api/role'
import { IRole } from '@/api/role/types'
import { formatDate } from '@/utils/utils'
import { DialogTypeEnum } from '@/api/common/types'
import { IDept } from '@/api/dept/types'
import { SEX_LIST, STATUS_LIST } from './utils'
import { hasPermission, hasPermissionShowDOM } from '@/directives/permission/permission'
import { ADMIN_USER_ID } from '@/api/common'

interface IProps {
  selectedDept: IDept
}

const props = withDefaults(defineProps<IProps>(), {
  selectedDept: () => {
    return {} as IDept
  }
})

const searchForm = ref<IQueryParams>({
  departmentId: props.selectedDept?.id || '',
  username: '',
  nickname: '',
  status: '',
  roleId: '',
  pageNum: 1,
  pageSize: 10
})
const total = ref(0)

const tableHeight = ref(400)
const columns = [
  {
    label: '用戶名',
    prop: 'username',
    align: 'center'
  },
  {
    label: '姓名',
    prop: 'nickname',
    align: 'center'
  },
  {
    label: '部门',
    prop: 'dept',
    align: 'center',
    slot: (h: () => VNode, { row }: { row: IUser }) => {
      return <span>{row.department?.name}</span>
    }
  },
  {
    label: '角色',
    prop: 'dept',
    align: 'center',
    slot: (h: () => VNode, { row }: { row: IUser }) => {
      const roles = row.roles || []
      return roles.map(role => {
        return <el-tag class="role-tag">{role.name}</el-tag>
      })
    }
  },
  {
    label: '性别',
    prop: 'sex',
    align: 'center',
    width: 60,
    slot: (h: () => VNode, { row }: { row: IUser }) => {
      const sexObj = SEX_LIST.find(item => item.value === row.sex)
      return <span>{sexObj ? sexObj.label : row.sex}</span>
    }
  },
  {
    label: '手机号码',
    prop: 'phoneNumber',
    align: 'center'
  },
  {
    label: '创建时间',
    prop: 'createTime',
    align: 'center',
    width: 160,
    slot: (h: () => VNode, { row }: { row: IUser }) => {
      return <span>{row.createTime && formatDate(new Date(row.createTime), 'yyyy-MM-dd HH:mm:ss')}</span>
    }
  },
  // {
  //   label: '编辑时间',
  //   prop: 'updateTime',
  //   align: 'center',
  //   width: 160,
  //   slot: (h: () => VNode, { row }: { row: IUser }) => {
  //     return <span>{row.updateTime && formatDate(new Date(row.updateTime), 'yyyy-MM-dd HH:mm:ss')}</span>
  //   }
  // },
  {
    label: '状态',
    prop: 'status',
    align: 'center',
    fixed: 'right',
    width: 100,
    slot: (h: () => VNode, { row }: { row: IUser }) => {
      return (
        <el-switch
          disabled={isAdminUser(row.id) || !hasPermission(['system:user:edit'])}
          model-value={row.status}
          active-value={StatusEnum.NORMAL}
          inactive-value={StatusEnum.STOP}
          onChange={(value: number) => handleStatusChange(value, row)}
        ></el-switch>
      )
    }
  },
  {
    label: '操作',
    width: 240,
    align: 'center',
    fixed: 'right',
    slot: (h: () => VNode, { row }: { row: IUser }) => {
      return (
        <div>
          {!isAdminUser(row.id) &&
            hasPermissionShowDOM(
              ['system:user:edit'],
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
          {!isAdminUser(row.id) &&
            hasPermissionShowDOM(
              ['system:user:delete'],
              <el-button type="danger" link icon={Delete} onClick={() => handleDelete(row)} class="danger-btn">
                删除
              </el-button>
            )}
          {!isAdminUser(row.id) &&
            hasPermissionShowDOM(
              ['system:user:resetPassword'],
              <el-button
                type="warning"
                link
                icon={RefreshLeft}
                onClick={() => {
                  handleResetPassword(row)
                }}
              >
                重置密码
              </el-button>
            )}
        </div>
      )
    }
  }
]
const tableData = ref<IUser[]>([])

// 状态list
const statusList = ref(STATUS_LIST)

/**
 * 计算表格高度
 */
const computedTableHeight = () => {
  nextTick(() => {
    setTimeout(() => {
      const container: HTMLDivElement = document.querySelector('.user-list-container') as HTMLDivElement
      const filterContainer: HTMLDivElement = document.querySelector('.filter-container') as HTMLDivElement
      const paginationContainer: HTMLDivElement = document.querySelector('.pagination-container') as HTMLDivElement
      tableHeight.value = container.offsetHeight - filterContainer.offsetHeight - paginationContainer.offsetHeight - 10 // 10 margin
    })
  })
}
/**
 * 是否是系统管理员用户
 * @param {number} id
 * @return {boolean}
 */
const isAdminUser = (id: number) => {
  return id === ADMIN_USER_ID
}

/**
 * 查询
 */
const onSearch = () => {
  searchForm.value.pageNum = 1
  getTableData()
}

/**
 * 获取用户列表
 */
const getTableData = () => {
  getUserList(searchForm.value).then(({ data }) => {
    tableData.value = data.list || []
    total.value = +data.total
  })
}

const roleList = ref<IRole[]>([])
/**
 * 获取角色列表
 */
const fetchRoleList = () => {
  getRoleList().then(({ data }) => {
    roleList.value = data || []
  })
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
 * @param {IUser} user
 */
const handleEdit = (user: IUser) => {
  saveDialogType.value = DialogTypeEnum.EDIT
  saveDialogData.value = user
  saveDialogVisible.value = true
}

/**
 * 删除
 * @param {IUser} user
 */
const handleDelete = (user: IUser) => {
  ElMessageBox.confirm('是否确认删除', '警告', { type: 'warning' })
    .then(() => {
      deleteUser(user.id).then(() => {
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
        getTableData()
      })
    })
    .catch(() => {})
}

/**
 * 变更状态
 * @param {number} value
 * @param {IUser} user
 */
const handleStatusChange = (value: number, user: IUser) => {
  const message = value === StatusEnum.NORMAL ? '启用' : '停用'
  ElMessageBox.confirm(`是否确认${message}"${user.username}账户"`, 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const params = {
      id: user.id,
      status: value
    }
    changeStatus(params).then(() => {
      ElMessage({
        type: 'success',
        message: '操作成功'
      })
      getTableData()
    })
  })
}

const resetPwdDialogData = ref()
const resetPwdDialogVisible = ref(false)
/**
 * 重置密码
 * @param {IUser} user
 */
const handleResetPassword = (user: IUser) => {
  resetPwdDialogData.value = user
  resetPwdDialogVisible.value = true
}

watch(
  () => props.selectedDept,
  dept => {
    searchForm.value.departmentId = dept?.id
    onSearch()
  }
)

onMounted(() => {
  computedTableHeight()
  fetchRoleList()
  getTableData()
})
</script>
<style scoped lang="scss">
.user-list-container {
  height: 100%;
  .search-form {
    .el-form-item {
      margin-right: 10px;
    }
  }
  .pagination-container {
    margin-top: 10px;
  }
}
</style>
