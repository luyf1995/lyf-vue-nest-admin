<script lang="ts">
import { defineComponent, h, VNode } from 'vue'

export default defineComponent({
  functional: true,
  props: {
    render: {
      // 表格列配置的render
      type: Function,
      default() {
        return function () {}
      }
    },
    scope: {
      // 作用域，继承自el-table
      type: Object,
      default() {
        return {}
      }
    }
  },
  setup(props) {
    return (): VNode => {
      return props.render(h, props.scope)
    }
  }
})
</script>
