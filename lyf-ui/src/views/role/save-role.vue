<template>
  <el-dialog
    v-model="dialogVisible"
    :title="buildTitle()"
    width="800px"
    draggable
    top="5vh"
    @open="$emit('update:modelValue', true)"
    @close="$emit('update:modelValue', false)"
  >
    <el-form
      v-if="dialogVisible"
      ref="saveFormRef"
      :model="saveForm"
      :rules="formRules"
      :disabled="formDisabled"
      label-position="right"
      label-width="90px"
      class="save-form"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="saveForm.name" placeholder="请输入" clearable :maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="角色标识" prop="code">
        <el-input v-model="saveForm.code" placeholder="请输入" clearable :maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number
          v-model="saveForm.sort"
          :min="1"
          :max="99"
          controls-position="right"
          class="block-item"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="权限" prop="permissions">
        <div class="per-panel">
          <div class="panel-header">
            <div class="panel-header__btn">
              <el-checkbox @change="(value:boolean) => handleCheckAll(permissionTree, value)">
                全选/全不选
              </el-checkbox>
              <el-checkbox @change="(value:boolean) => handleExpandOrFold(value)"> 展开/折叠 </el-checkbox>
            </div>
          </div>
          <div class="panel-body">
            <el-tree
              ref="permissionTreeRef"
              :data="permissionTree"
              show-checkbox
              node-key="id"
              :props="{ label: 'name' }"
              empty-text="暂无数据"
              :check-strictly="true"
            >
              <template #default="{ data }">
                <span class="custom-tree-node">
                  <span>{{ data.name }}</span>
                  <span v-if="Array.isArray(data.children) && data.children.length > 0">
                    <el-button link type="primary" class="node-btn" @click.stop="handleCheckAll([data], true)"
                      >全选</el-button
                    >
                    <el-button link type="primary" class="node-btn" @click.stop="handleCheckAll([data], false)"
                      >取消全选</el-button
                    >
                  </span>
                </span>
              </template>
            </el-tree>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="dialogType === DialogTypeEnum.ADD ? handleAdd() : handleEdit()"
          >确定</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { ElTree } from 'element-plus'

import { DialogTypeEnum } from '@/api/common/types'
import { IRole, ISaveRole } from '@/api/role/types'
import { addRole, editRole, getDetailById } from '@/api/role/index'
import { getPermissionList } from '@/api/permission/index'
import { IPermission } from '@/api/permission/types'
import { arrayToTree } from '@/utils/utils'
import { TreeKey } from 'element-plus/es/components/tree/src/tree.type'

const DEFAULT_FORM = {
  id: undefined,
  name: '',
  code: '',
  sort: 1,
  permissions: [] // 权限id集合
}

interface IProps {
  modelValue: boolean
  dialogType: DialogTypeEnum
  data: IRole // 编辑数据
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: false,
  dialogType: DialogTypeEnum.ADD,
  data: () => {
    return {} as IRole
  }
})

const emits = defineEmits<{
  (e: 'update:modelValue'): void
  (e: 'success'): void
}>()

const dialogVisible = ref(false)
const saveForm = ref<ISaveRole>(Object.assign({}, DEFAULT_FORM))
const saveFormRef = ref()
const formRules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入角色标识', trigger: 'blur' }],
  sort: [{ required: true, message: '请输入排序', trigger: 'blur' }]
}

// 权限树
const permissionTree = ref<IPermission[]>([])
const permissionTreeRef = ref<InstanceType<typeof ElTree>>()

watch(
  () => props.modelValue,
  newValue => {
    if (newValue) {
      show()
    } else {
      close()
    }
  }
)

// 表单不可编辑
const formDisabled = computed(() => {
  return props.dialogType === DialogTypeEnum.VIEW
})

/**
 * 显示
 */
const show = () => {
  init()
  dialogVisible.value = true
}
/**
 * 关闭
 */
const close = () => {
  dialogVisible.value = false
}

/**
 * dialog title
 */
const buildTitle = () => {
  if (props.dialogType === DialogTypeEnum.ADD) {
    return '新增角色'
  } else if (props.dialogType === DialogTypeEnum.EDIT) {
    return '编辑角色'
  } else {
    return '角色详情'
  }
}
/**
 * 初始化
 */
const init = async () => {
  if (props.dialogType === DialogTypeEnum.ADD) {
    // 新增
    saveForm.value = Object.assign({}, DEFAULT_FORM)
  } else {
    // 编辑、查看
    const detail = await getRoleDetailById(props.data.id)

    // 权限ids
    const permissionIds = detail.permissions.map(item => item.id) || []

    saveForm.value = Object.assign({}, DEFAULT_FORM, detail, {
      permissions: permissionIds
    })

    permissionTreeRef.value?.setCheckedKeys(permissionIds as unknown as TreeKey[])
  }
  fetchPermissionList()
}

/**
 * 获取权限list
 */
const fetchPermissionList = () => {
  getPermissionList().then(({ data }) => {
    permissionTree.value = arrayToTree(data || [])
  })
}

/**
 * 通过角色id获取角色详情
 * @param {Number} id
 */
const getRoleDetailById = (id: number) => {
  return getDetailById(id).then(({ data }) => {
    return data || {}
  })
}

/**
 * 全选/全不选
 * @param {IPermission[]} data
 * @param {boolean} isChecked
 */
const handleCheckAll = (data: IPermission[] = [], isChecked: boolean) => {
  // 当前选中节点集合
  let checkedNodes = permissionTreeRef.value?.getCheckedNodes() || []

  const traverse = (nodes: IPermission[]) => {
    nodes.forEach(node => {
      if (isChecked) {
        checkedNodes.push(node)
      } else {
        checkedNodes = checkedNodes.filter(item => item.id !== node.id)
      }
      if (Array.isArray(node.children) && node.children.length > 0) {
        traverse(node.children)
      }
    })
  }

  traverse(data)

  permissionTreeRef.value?.setCheckedNodes(checkedNodes as any)
}
/**
 * 折叠/展开
 * @param {boolean} value
 */
const handleExpandOrFold = (value: boolean) => {
  for (let i = 0, length = permissionTree.value.length; i < length; i++) {
    permissionTreeRef.value!.store.nodesMap[permissionTree.value[i].id].expanded = value
  }
}

/**
 * 校验
 * @param {Function} callback
 */
const doValidate = (callback: (params: ISaveRole) => void) => {
  saveFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const params = Object.assign({}, saveForm.value)

      params.permissions = (permissionTreeRef.value?.getCheckedKeys() || []) as number[]

      callback(params)
    } else {
      return false
    }
  })
}
/**
 * 新增
 */
const handleAdd = () => {
  doValidate((params: ISaveRole) => {
    addRole(params).then(() => {
      emits('success')
      ElMessage({
        type: 'success',
        message: '新增成功'
      })
      close()
    })
  })
}
/**
 * 编辑
 */
const handleEdit = () => {
  doValidate((params: ISaveRole) => {
    editRole(params).then(() => {
      emits('success')
      ElMessage({
        type: 'success',
        message: '编辑成功'
      })
      close()
    })
  })
}
</script>
<style scoped lang="scss">
.block-item {
  width: 100%;
}
.per-panel {
  flex: 1;
  border: 1px solid #e5e6e7;
  min-height: 100px;
  border-radius: 4px;
  line-height: normal;
  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e5e6e7;
    padding: 5px 10px;
    background-color: #fbfbfb;
    &__title {
      font-weight: bold;
    }
  }
  .panel-body {
    padding: 10px 5px;
  }
}
.save-form {
  :deep(.el-checkbox__input.is-disabled.is-checked) {
    .el-checkbox__inner {
      background-color: $--color-primary;
      border-color: $--color-primary;
    }
    .el-checkbox__inner::after {
      border-color: #fff;
    }
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .node-btn {
      margin-left: 20px;
    }
  }
}
</style>
