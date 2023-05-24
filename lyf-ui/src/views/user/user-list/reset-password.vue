<template>
  <el-dialog
    v-model="dialogVisible"
    title="重置密码"
    width="400px"
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
      <el-form-item label="密码" prop="password">
        <el-input v-model="saveForm.password" placeholder="请输入" clearable :maxlength="64" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="saveForm.confirmPassword"
          placeholder="请输入"
          clearable
          :maxlength="64"
          show-password
        ></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handleReset">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

import { DialogTypeEnum } from '@/api/common/types'
import { resetPassword } from '@/api/user/index'
import { IUser, IChangePassword } from '@/api/user/types'

const DEFAULT_FORM = {
  id: 0,
  password: '',
  confirmPassword: ''
}

interface IProps {
  modelValue: boolean
  data: IUser // 数据
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: false,
  data: () => {
    return {} as IUser
  }
})

const emits = defineEmits<{
  (e: 'update:modelValue'): void
  (e: 'success'): void
}>()

const dialogVisible = ref(false)
const saveForm = ref<IChangePassword>(Object.assign({}, DEFAULT_FORM))
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
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
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
 * 初始化
 */
const init = async () => {
  // 新增
  saveForm.value = Object.assign({}, DEFAULT_FORM, {
    id: props.data.id
  })
}

/**
 * 校验
 * @param {Fucntion} callback
 */
const doValidate = (callback: (params: IChangePassword) => void) => {
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
 * 重置密码
 */
const handleReset = () => {
  doValidate((params: IChangePassword) => {
    resetPassword(params).then(() => {
      emits('success')
      ElMessage({
        type: 'success',
        message: '重置成功'
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
