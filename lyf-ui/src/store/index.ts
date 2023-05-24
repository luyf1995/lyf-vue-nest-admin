import { createPinia } from 'pinia'
const pinia = createPinia()

import useAppStore from './app'
import useUserStore from './user'
import usePermissionStore from './permission'

export default pinia
export { useAppStore, useUserStore, usePermissionStore }
