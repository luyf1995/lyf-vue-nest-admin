<template>
  <div class="filter-layout">
    <div class="search-contianer">
      <slot name="search"></slot>
    </div>
    <div class="button-contianer">
      <slot name="button"></slot>
    </div>
  </div>
</template>
<style scoped lang="scss">
.filter-layout {
  display: flex;
  width: 100%;
  justify-content: space-between;
  :deep(.el-form) {
    .el-form-item {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
}
</style>
