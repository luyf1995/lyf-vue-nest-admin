<template>
  <!-- TODO 内置组件component v-bind绑定对象时，component组件失效 -->
  <!-- <component v-bind="linkProps(to)">
    <slot />
  </component> -->
  <component :is="linkProps(to).is" :to="linkProps(to).to">
    <slot />
  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { isExternal } from '@/utils/validate'

export default defineComponent({
  props: {
    to: {
      type: String,
      required: true
    }
  },
  setup() {
    function linkProps(url: string) {
      if (isExternal(url)) {
        return {
          is: 'a',
          href: url,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        is: 'router-link',
        to: url
      }
    }
    return {
      linkProps
    }
  }
})
</script>
