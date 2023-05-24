import { DirectiveBinding } from 'vue'

const map = new WeakMap()
const observer = new ResizeObserver(entries => {
  for (let entriy of entries) {
    const handler = map.get(entriy.target)
    if (handler) {
      const size = {
        with: entriy.contentRect?.width,
        height: entriy.contentRect?.height
      }
      handler(size)
    }
  }
})

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    observer.observe(el)
    map.set(el, binding.value)
  },
  unmounted(el: HTMLElement) {
    observer.unobserve(el)
    map.delete(el)
  }
}
