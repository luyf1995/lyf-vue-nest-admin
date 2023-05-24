import type { App } from 'vue'

import permission from './permission/permission'
import role from './permission/role'
import resize from './resize/index'

const install = (app: App<Element>) => {
  app.directive('permission', permission)
  app.directive('role', role)
  app.directive('resize', resize)
}

export default install
