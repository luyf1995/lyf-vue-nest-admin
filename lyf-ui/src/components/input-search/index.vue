<template>
  <el-input
    v-model="inputValue"
    placeholder="请输入关键字查询"
    :prefix-icon="Search"
    clearable
    v-bind="$attrs"
    class="filter-input"
    @input="handleInput"
    @keyup.enter="handleEnter"
  >
  </el-input>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'

import { debounce } from '@/utils/utils'

interface IProps {
  modalValue: string
}
const props = withDefaults(defineProps<IProps>(), {
  modalValue: ''
})
const emits = defineEmits<{
  (e: 'update:modalValue', data: string): void
  (e: 'search', data: string): void
  (e: 'enter', data: string): void
}>()

const inputValue = ref(props.modalValue)

watch(
  () => props.modalValue,
  newValue => {
    inputValue.value = newValue
  }
)

/**
 * 值改变时触发
 */
const handleInput = debounce(function () {
  emits('update:modalValue', inputValue.value)
  emits('search', inputValue.value)
}, 200)
/**
 * enter 触发
 */
const handleEnter = () => {
  emits('enter', inputValue.value)
}
</script>
<style scoped lang="scss">
.filter-input {
  width: auto;
  min-width: 240px;
}
</style>
