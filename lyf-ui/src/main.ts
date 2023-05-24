import { createApp } from 'vue'
import App from './App.vue'

import router from '@/router/index'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'

import pinia from '@/store/index'
// 全局样式
import '@/styles/index.scss'
// 权限控制
import '@/permission.ts'
// iconfont 字体图标
import '@/assets/iconfonts/iconfont.js'
// 全局指令
import directives from '@/directives/index'

const app = createApp(App)
app.use(router).use(pinia).use(ElementPlus, { locale }).use(directives).mount('#app')
