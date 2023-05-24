<template>
  <div class="navbar">
    <div class="navbar__left">
      <breadcrumb></breadcrumb>
    </div>
    <div class="navbar__right">
      <fullscreen></fullscreen>
      <user></user>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

import Fullscreen from './fullscreen/index.vue'
import User from './user/index.vue'
import Breadcrumb from './breadcrumb/index.vue'

export default defineComponent({
  components: {
    Fullscreen,
    User,
    Breadcrumb
  }
})
</script>
<style scoped lang="scss">
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  padding: 0 20px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  &__right {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
</style>
