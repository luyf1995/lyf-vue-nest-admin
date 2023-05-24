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
      <el-form-item label="父部门" prop="parentId">
        <el-tree-select
          v-model="saveForm.parentId"
          :data="deptTree"
          :render-after-expand="false"
          default-expand-all
          :expand-on-click-node="false"
          :props="{
            label: 'name'
          }"
          node-key="id"
          clearable
          filerable
          check-strictly
          class="block-item"
        >
        </el-tree-select>
      </el-form-item>
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="saveForm.name" placeholder="请输入" clearable :maxlength="64"></el-input>
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
import { IDept, ISaveDept, IDeptTree } from '@/api/dept/types'
import { getDeptList, getDeptListExclude, addDept, editDept } from '@/api/dept/index'
import { arrayToTree } from '@/utils/utils'

const DEFAULT_FORM = {
  id: undefined,
  name: '',
  parentId: '',
  sort: 1
}

interface IProps {
  modelValue: boolean
  dialogType: DialogTypeEnum
  data: IDept | Record<string, unknown> // 编辑数据
  parentId?: number | string
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: false,
  dialogType: DialogTypeEnum.ADD,
  data: () => {
    return {}
  },
  parentId: ''
})

const emits = defineEmits<{
  (e: 'update:modelValue'): void
  (e: 'success'): void
}>()

const dialogVisible = ref(false)
const saveForm = ref<ISaveDept>(Object.assign({}, DEFAULT_FORM))
const saveFormRef = ref()
const formRules = {
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
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
  fetchDeptList()

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
  return props.dialogType === DialogTypeEnum.ADD ? '新增部门' : '编辑部门'
}

const deptTree = ref<IDeptTree[]>([])
/**
 * 获取部门列表
 */
const fetchDeptList = () => {
  let fetchApi, fetchParams
  if (props.dialogType === DialogTypeEnum.EDIT) {
    fetchApi = getDeptListExclude
    fetchParams = props.data.id
  } else {
    fetchApi = getDeptList
  }

  fetchApi(fetchParams as any).then(({ data }) => {
    deptTree.value = arrayToTree(data || [])
  })
}

/**
 * 校验
 * @param {Fucntion} callback
 */
const doValidate = (callback: (params: ISaveDept) => void) => {
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
  doValidate((params: ISaveDept) => {
    addDept(params).then(() => {
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
  doValidate((params: ISaveDept) => {
    editDept(params).then(() => {
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
