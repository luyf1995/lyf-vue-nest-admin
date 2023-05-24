<template>
  <el-dialog
    v-model="dialogVisible"
    :title="buildTitle()"
    width="500px"
    draggable
    @open="$emit('update:modelValue', true)"
    @close="$emit('update:modelValue', false)"
  >
    <el-form
      v-if="dialogVisible"
      ref="saveFormRef"
      :model="saveForm"
      :rules="formRules"
      label-position="right"
      label-width="90px"
    >
      <el-form-item label="权限类型" prop="type">
        <el-radio-group v-model="saveForm.type">
          <el-radio v-for="item in PERMISSION_TYPE_LIST" :key="item.value" :label="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="父权限" prop="parentId">
        <el-tree-select
          v-model="saveForm.parentId"
          :data="permissionTree"
          :render-after-expand="false"
          default-expand-all
          :expand-on-click-node="false"
          :check-strictly="true"
          :props="{
            label: 'name'
          }"
          node-key="id"
          filterable
          clearable
          class="block-item"
        >
          <template #default="{ data: { name, code } }">
            <div class="node-item">
              <span>{{ name }}</span>
              <span class="node-item__code">({{ code }})</span>
            </div>
          </template>
        </el-tree-select>
      </el-form-item>
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="saveForm.name" placeholder="请输入" clearable :maxlength="64"></el-input>
      </el-form-item>
      <el-form-item v-if="saveForm.type !== PermissionTypeEnum.DIRECTORY" label="权限标识" prop="code">
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
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

import { DialogTypeEnum } from '@/api/common/types'
import { IPermission, ISavePermission, PermissionTypeEnum } from '@/api/permission/types'
import { addPermission, editPermission } from '@/api/permission/index'
import { PERMISSION_TYPE_LIST } from './utils'

const DEFAULT_FORM = {
  id: undefined,
  name: '',
  parentId: '',
  code: '',
  type: PermissionTypeEnum.DIRECTORY,
  sort: 1
}

interface IProps {
  modelValue: boolean
  dialogType: DialogTypeEnum
  data: IPermission | Record<string, unknown> // 编辑数据
  permissionTree: IPermission[] // 权限树
  parentId?: number | string
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: false,
  dialogType: DialogTypeEnum.ADD,
  data: () => {
    return {}
  },
  permissionTree: () => [],
  parentId: ''
})

const emits = defineEmits<{
  (e: 'update:modelValue'): void
  (e: 'success'): void
}>()

const dialogVisible = ref(false)
const saveForm = ref<ISavePermission>(Object.assign({}, DEFAULT_FORM))
const saveFormRef = ref()
const formRules = {
  name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
  // code: [{ required: true, message: '请输入权限标识', trigger: 'blur' }],
  type: [{ required: true, message: '请选择权限类型', trigger: 'blur' }],
  sort: [{ required: true, message: '请输入排序', trigger: 'blur' }]
}

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
 * 初始化
 */
const init = () => {
  if (props.dialogType === DialogTypeEnum.ADD) {
    saveForm.value = Object.assign({}, DEFAULT_FORM, {
      parentId: props.parentId
    })
  } else {
    saveForm.value = Object.assign({}, DEFAULT_FORM, props.data)
  }
  if (saveForm.value.parentId === 0) {
    saveForm.value.parentId = ''
  }
}
/**
 * dialog title
 */
const buildTitle = () => {
  return props.dialogType === DialogTypeEnum.ADD ? '新增权限' : '编辑权限'
}

/**
 * 校验
 * @param {Fucntion} callback
 */
const doValidate = (callback: (params: ISavePermission) => void) => {
  saveFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const params = Object.assign({}, saveForm.value)
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
  doValidate((params: ISavePermission) => {
    addPermission(params).then(() => {
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
  doValidate((params: ISavePermission) => {
    editPermission(params).then(() => {
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
</style>
