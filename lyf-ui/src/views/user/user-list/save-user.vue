<template>
  <el-dialog
    v-model="dialogVisible"
    :title="buildTitle()"
    width="700px"
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
      label-width="80px"
      class="save-form"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="saveForm.username" placeholder="请输入" clearable :maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" prop="nickname">
            <el-input v-model="saveForm.nickname" placeholder="请输入" clearable :maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="dialogType === DialogTypeEnum.ADD" :span="12">
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="saveForm.password"
              placeholder="请输入"
              clearable
              :maxlength="64"
              show-password
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="dialogType === DialogTypeEnum.ADD" :span="12">
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="saveForm.confirmPassword"
              placeholder="请输入"
              clearable
              :maxlength="64"
              show-password
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="saveForm.status">
              <el-radio v-for="item in STATUS_LIST" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门" prop="departmentId">
            <el-tree-select
              v-model="saveForm.departmentId"
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
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色" prop="roleId">
            <el-select v-model="saveForm.roleId" clearable filterable multiple placeholder="请输入" class="block-item">
              <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="saveForm.sex">
              <el-radio v-for="item in SEX_LIST" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phoneNumber">
            <el-input v-model="saveForm.phoneNumber" placeholder="请输入" clearable :maxlength="64"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
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
import { IUser, ISaveUser, SexEnum, StatusEnum } from '@/api/user/types'
import { addUser, editUser, getDetailById } from '@/api/user/index'
import { arrayToTree } from '@/utils/utils'
import { STATUS_LIST, SEX_LIST } from './utils'
import { IDeptTree } from '@/api/dept/types'
import { getDeptList } from '@/api/dept/index'
import { IRole } from '@/api/role/types'
import { getRoleList } from '@/api/role'

const DEFAULT_FORM = {
  id: undefined,
  username: '',
  nickname: '',
  password: '',
  confirmPassword: '',
  status: StatusEnum.NORMAL,
  departmentId: '',
  roleId: [],
  sex: SexEnum.UNKNOWN,
  phoneNumber: ''
}

interface IProps {
  modelValue: boolean
  dialogType: DialogTypeEnum
  data: IUser // 编辑数据
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: false,
  dialogType: DialogTypeEnum.ADD,
  data: () => {
    return {} as IUser
  }
})

const emits = defineEmits<{
  (e: 'update:modelValue'): void
  (e: 'success'): void
}>()

const dialogVisible = ref(false)
const saveForm = ref<ISaveUser>(Object.assign({}, DEFAULT_FORM))
const saveFormRef = ref()

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (value !== saveForm.value.password) {
    callback(new Error('两次密码不一致!'))
  } else {
    callback()
  }
}
const formRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度必须介于 2 和 20 之间', trigger: 'blur' }
  ],
  nickname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
  phoneNumber: [
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur'
    }
  ]
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
 * dialog title
 */
const buildTitle = () => {
  return props.dialogType === DialogTypeEnum.ADD ? '新增用户' : '编辑用户'
}
/**
 * 初始化
 */
const init = async () => {
  fetchDeptList()
  fetchRoleList()
  if (props.dialogType === DialogTypeEnum.ADD) {
    // 新增
    saveForm.value = Object.assign({}, DEFAULT_FORM)
  } else {
    // 编辑、查看
    const detail = await getUserDetailById(props.data.id)

    saveForm.value = Object.assign({}, DEFAULT_FORM, detail)
  }
}

/**
 * 通过id获取用户详情
 * @param {Number} id
 */
const getUserDetailById = (id: number) => {
  return getDetailById(id).then(({ data = {} }) => {
    const detail = Object.assign({}, data, {
      roleId: (data.roles || []).map(item => item.id)
    })
    return detail
  })
}

// 部门树
const deptTree = ref<IDeptTree[]>([])
/**
 * 获取部门list
 */
const fetchDeptList = () => {
  getDeptList().then(({ data }) => {
    deptTree.value = arrayToTree(data || [])
  })
}

// 角色list
const roleList = ref<IRole[]>([])
/**
 * 获取部门list
 */
const fetchRoleList = () => {
  getRoleList().then(({ data }) => {
    roleList.value = data || []
  })
}

/**
 * 校验
 * @param {Fucntion} callback
 */
const doValidate = (callback: (params: ISaveUser) => void) => {
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
  doValidate((params: ISaveUser) => {
    addUser(params).then(() => {
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
  doValidate((params: ISaveUser) => {
    editUser(params).then(() => {
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
