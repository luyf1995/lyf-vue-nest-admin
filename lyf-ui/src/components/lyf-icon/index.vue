<template>
  <span class="lyf-icon" :title="title">
    <svg aria-hidden="true">
      <use :xlink:href="iconName"></use>
    </svg>
  </span>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

interface IProps {
  iconClass: string
  title?: string
}

const props = withDefaults(defineProps<IProps>(), {
  iconClass: '',
  title: ''
})

const iconName = computed(() => {
  return `#${props.iconClass}`
})
</script>
<style scoped lang="scss">
.lyf-icon svg {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
