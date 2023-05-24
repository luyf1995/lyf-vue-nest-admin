<template>
  <div class="login-container">
    <div class="form-container">
      <h1 class="login-title">系统登录</h1>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        label-width="0px"
        class="login-form"
        :rules="rules"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="用户名" :prefix-icon="User"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="密码"
            type="password"
            :prefix-icon="Lock"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="remember" class="rem-checkbox">记住密码</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ILogin } from '@/api/user/types'
import { useUserStore } from '@/store/index'
import { useRouter } from 'vue-router'
import { Local } from '@/utils/storage'

const userStore = useUserStore()
const router = useRouter()

const loginFormRef = ref<FormInstance>()

const rules = reactive<FormRules>({
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    }
  ]
})

const loginForm = reactive<ILogin>({
  username: '',
  password: ''
})

const remember = ref<boolean>(true)
/**
 * 记住、清除密码
 */
const rememberOrClearPsw = () => {
  if (remember.value) {
    Local.set('username', loginForm.username)
    Local.set('password', loginForm.password)
  } else {
    Local.remove('username')
    Local.remove('password')
  }
}
onMounted(() => {
  const username = Local.get('username')
  const password = Local.get('password')
  if (username && password) {
    loginForm.username = username
    loginForm.password = password
  }
})

/**
 * 登录
 */
const handleLogin = () => {
  loginFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      await userStore.login(loginForm)

      rememberOrClearPsw()

      router.push('/')
    } else {
      return false
    }
  })
}
</script>
<style scoped lang="scss">
.login-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #2d3a4b;
  .form-container {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 520px;
    padding: 0 35px;
    // height: 280px;
    .login-title {
      color: #fff;
      margin-bottom: 40px;
      font-weight: normal;
      font-size: 26px;
    }
    :deep(.login-form) {
      width: 100%;
      height: 100%;
      .el-form-item {
        margin-bottom: 22px;
      }
      .el-input__wrapper {
        background-color: rgba(0, 0, 0, 0.1);
        border: 1px solid hsla(0, 0%, 100%, 0.1);
        box-shadow: none;
      }
      .el-input__inner {
        height: 48px;
        line-height: 48px;
        color: #fff;
      }
      .el-input__prefix {
        font-size: 18px;
      }
      .rem-checkbox {
        .el-checkbox__label {
          color: #fff;
        }
      }
      .device-item {
        color: #fff;
      }
      .login-btn {
        width: 100%;
        height: 38px;
      }
    }
  }
}
</style>
