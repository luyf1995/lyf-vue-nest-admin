import { createRouter, createWebHashHistory } from 'vue-router'

import { staticRoutes } from './static-routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes: staticRoutes
})

export default router
