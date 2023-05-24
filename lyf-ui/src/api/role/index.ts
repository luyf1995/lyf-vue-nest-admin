import { request } from '@/utils/request'
import { AxiosPromise } from 'axios'
import { ISaveRole, IQueryParams, IRole, IRoleDetail } from './types'

/**
 * 获取角色列表
 * @param {IQueryParams} params
 */
export const getRoleList = (params?: IQueryParams): AxiosPromise<IRole[]> =>
  request({
    method: 'get',
    url: '/role/list',
    params
  })

/**
 * 新增角色
 * @param {ISaveRole} data
 */
export const addRole = (data: ISaveRole) =>
  request({
    method: 'post',
    url: '/role',
    data
  })

/**
 * 编辑角色
 * @param {ISaveRole} data
 */
export const editRole = (data: ISaveRole) =>
  request({
    method: 'put',
    url: '/role',
    data
  })

/**
 * 删除角色
 * @param {Number} id
 */
export const deleteRole = (id: number) =>
  request({
    method: 'delete',
    url: `/role/${id}`
  })

/**
 * 获取角色详情
 * @param {Number} id
 */
export const getDetailById = (id: number): AxiosPromise<IRoleDetail> =>
  request({
    method: 'get',
    url: `/role/${id}`
  })
