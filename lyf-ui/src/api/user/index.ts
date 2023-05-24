import { request } from '@/utils/request'
import { AxiosPromise } from 'axios'
import {
  ILogin,
  ILoginResult,
  IUserInfo,
  ISaveUser,
  IQueryParams,
  IUser,
  IUserDetail,
  IChangeStatus,
  IChangePassword
} from './types'
import { IPageResult } from '../common/types'

/**
 * 登录
 * @param {Object} data
 */
export function login(data: ILogin): AxiosPromise<ILoginResult> {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

/**
 * 登出
 */
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
/**
 * 获取用户信息
 */
export function getUserInfo(): AxiosPromise<IUserInfo> {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

/**
 * 获取用户列表
 * @param {IQueryParams} params
 */
export const getUserList = (params: IQueryParams): AxiosPromise<IPageResult<IUser[]>> =>
  request({
    method: 'get',
    url: '/user/list',
    params
  })

/**
 * 新增用户
 * @param {ISaveUser} data
 */
export const addUser = (data: ISaveUser) =>
  request({
    method: 'post',
    url: '/user',
    data
  })

/**
 * 编辑用户
 * @param {ISaveUser} data
 */
export const editUser = (data: ISaveUser) =>
  request({
    method: 'put',
    url: '/user',
    data
  })

/**
 * 删除用户
 * @param {Number} id
 */
export const deleteUser = (id: number) =>
  request({
    method: 'delete',
    url: `/user/${id}`
  })

/**
 * 通过id获取详情
 * @param {number} id
 */
export const getDetailById = (id: number): AxiosPromise<IUserDetail> =>
  request({
    method: 'get',
    url: `/user/${id}`
  })

/**
 * 启用/停用
 * @param {IChangeStatus} data
 */
export const changeStatus = (data: IChangeStatus) =>
  request({
    method: 'put',
    url: '/user/change-status',
    data
  })
/**
 * 重置密码
 * @param {IChangePassword} data
 */
export const resetPassword = (data: IChangePassword) =>
  request({
    method: 'put',
    url: '/user/reset-password',
    data
  })
