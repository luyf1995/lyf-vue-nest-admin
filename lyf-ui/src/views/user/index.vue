<template>
  <div class="user-container">
    <div class="dept-layout">
      <dept-tree @change="data => (selectedDept = data)"></dept-tree>
    </div>
    <div class="user-layout">
      <user-list :selected-dept="selectedDept"></user-list>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

import DeptTree from './dept-tree.vue'
import UserList from './user-list/index.vue'

// 当前选中部门
const selectedDept = ref()
</script>
<style scoped lang="scss">
.user-container {
  display: flex;
  width: 100%;
  height: 100%;
  .dept-layout {
    width: 250px;
    flex-shrink: 0;
    height: 100%;
    padding: 10px;
    background-color: #fff;
  }
  .user-layout {
    flex: 1;
    height: 100%;
    padding: 10px;
    margin-left: 10px;
    overflow-x: hidden;
  }
}
</style>
