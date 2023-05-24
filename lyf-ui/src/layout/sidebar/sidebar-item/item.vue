<script lang="tsx">
import { defineComponent, toRefs } from 'vue'

export default defineComponent({
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: [String, Function],
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const { title } = toRefs(props)
    const vnodes: any = []
    if (title) {
      vnodes.push(<span class="menu-title">{title.value}</span>)
    }
    return () => vnodes
  }
})
</script>
<style lang="scss">
.menu-title {
  vertical-align: middle;
  margin-left: 20px;
}
</style>
