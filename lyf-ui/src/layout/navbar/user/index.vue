<template>
  <div class="user-container">
    <el-avatar :size="30">
      <img src="~@/assets/images/user.gif" class="user-icon" />
    </el-avatar>
    <el-dropdown>
      <span class="user-name">
        {{ userInfo?.nickname }}
        <lyf-icon icon-class="icon-xiala" class="dropdown-icon"></lyf-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useUserStore } from '@/store/index'
import { useRouter } from 'vue-router'

import LyfIcon from '@/components/lyf-icon/index.vue'

export default defineComponent({
  components: {
    LyfIcon
  },
  setup() {
    const userStore = useUserStore()
    const router = useRouter()

    const userInfo = computed(() => {
      return userStore.userInfo
    })

    /**
     * 退出登录
     * @return {void}
     */
    const handleLogout = async () => {
      await userStore.logout()
      router.push('/login')
    }
    return {
      userInfo,
      handleLogout
    }
  }
})
</script>
<style scoped lang="scss">
.user-container {
  display: flex;
  align-items: center;
  margin-left: 20px;
  .user-name {
    margin-left: 10px;
    cursor: pointer;
  }
  .dropdown-icon {
    font-size: 20px;
    cursor: pointer;
  }
}
</style>
