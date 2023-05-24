import { request } from '@/utils/request'
import { AxiosPromise } from 'axios'
import { ISavePermission, IPermission, IQueryParams } from './types'

/**
 * 获取权限列表
 */
export const getPermissionList = (params?: IQueryParams): AxiosPromise<IPermission[]> =>
  request({
    method: 'get',
    url: '/permission/list',
    params
  })

/**
 * 新增权限
 * @param {ISavePermission} data
 */
export const addPermission = (data: ISavePermission) =>
  request({
    method: 'post',
    url: '/permission',
    data
  })

/**
 * 编辑权限
 * @param {ISavePermission} data
 */
export const editPermission = (data: ISavePermission) =>
  request({
    method: 'put',
    url: '/permission',
    data
  })

/**
 * 删除权限
 * @param {Number} id
 */
export const deletePermission = (id: number) =>
  request({
    method: 'delete',
    url: `/permission/${id}`
  })
