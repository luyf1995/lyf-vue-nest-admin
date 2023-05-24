import { defineStore } from 'pinia'
import { Session } from '@/utils/storage'
import { login, logout, getUserInfo } from '@/api/user/index'
import { ILogin, IUserInfo } from '@/api/user/types'

interface IUserState {
  token: string
  userInfo: IUserInfo | null
}

const userStore = defineStore('user', {
  state: (): IUserState => {
    return {
      token: Session.get('token'),
      userInfo: null
    }
  },
  getters: {},
  actions: {
    /**
     * 设置Token
     * @param {String} token
     */
    setToken(token: string) {
      this.token = token
      Session.set('token', token)
    },
    /**
     * 获取用户信息
     */
    getUserInfo() {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then(({ data }) => {
            this.setUserInfo(data)
            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    /**
     * 设置用户信息
     * @param {Object} userInfo
     */
    setUserInfo(userInfo: IUserInfo | null) {
      this.userInfo = userInfo
      Session.set('userInfo', userInfo)
    },
    /**
     * 登录
     * @param {Object} loginForm
     */
    login(loginForm: ILogin) {
      return new Promise(resolve => {
        login(loginForm).then(({ data }) => {
          const token = data.token
          this.setToken(token)
          resolve(token)
        })
      })
    },
    /**
     * 登出
     */
    logout() {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            this.removeToken()
            this.removeUserInfo()
            resolve(null)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    /**
     * 前端登出
     * @param {Boolean} needClear 是否需要清空sessionStorage中的信息
     */
    logoutByFrontEnd(needClear = true) {
      if (needClear) {
        this.removeToken()
        this.removeUserInfo()
      }
    },
    /**
     * 移除Token
     * @return {Promise}
     */
    removeToken() {
      this.setToken('')
      Session.remove('token')
    },
    /**
     * 移除用户信息
     * @return {Promise}
     */
    removeUserInfo() {
      this.setUserInfo(null)
    }
  }
})

export default userStore
