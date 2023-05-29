import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import router from '@/router/index'
import { ElMessage, ElLoading } from 'element-plus'

import { Code, IResponse } from '@/api/common/types'
import { API_BASE } from '@/api/common/index'
import { useUserStore } from '@/store/index'

let userStore: any

let loadingInstance: any

// 请求队列
let queue = new Map()

/**
 * 移除队列中的url并且关闭loading
 * @param {String} url
 */
const removeQueueAndCancelLoading = (url?: string) => {
  if (!url) return
  queue.delete(url)
  if (queue.size === 0) {
    loadingInstance && loadingInstance.close()
  }
}

export const request = axios.create({
  baseURL: API_BASE + '/api',
  // withCredentials: true,
  timeout: 5000
})

// 请求拦截
request.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    !userStore && (userStore = useUserStore())

    config!.headers!.Authorization = 'Bearer ' + userStore.token
    const url = config.url
    if (queue.size === 0) {
      loadingInstance = ElLoading.service({
        fullscreen: true,
        text: '加载中',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    }
    queue.set(url, true)

    return config
  },
  error => {
    removeQueueAndCancelLoading(error.config.url)
    return Promise.reject(error)
  }
)

// 响应拦截
request.interceptors.response.use(
  (response: AxiosResponse) => {
    removeQueueAndCancelLoading(response.config.url)

    const { code, message }: IResponse<any> = response.data
    if (code === Code.SUCCCESS) {
      return response.data
    } else if (code === Code.UNAUTHORIZED) {
      ElMessage({
        message: '用户登录失效，请重新登录！',
        type: 'error',
        duration: 5 * 1000
      })
      userStore.logoutByFrontEnd()
      router.push('/login')
    } else {
      ElMessage({
        message: message,
        type: 'error'
      })
      return Promise.reject(response.data)
    }
  },
  error => {
    !userStore && (userStore = useUserStore())

    const { status, data } = error.response || {}
    removeQueueAndCancelLoading(error.config.url)
    if (!status) {
      ElMessage({
        message: '网络连接失败，请联系管理员。',
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      // 非取消请求的报错需要弹框展示
      if (!(error instanceof axios.Cancel)) {
        ElMessage({
          message: data.message,
          type: 'error',
          duration: 5 * 1000
        })
      }
    }

    return Promise.reject(error)
  }
)

export default request
