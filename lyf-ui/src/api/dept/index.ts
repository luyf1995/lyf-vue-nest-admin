import { request } from '@/utils/request'
import { AxiosPromise } from 'axios'
import { ISaveDept, IQueryParams, IDept } from './types'

/**
 * 获取部门列表
 * @param {IQueryParams} params
 */
export const getDeptList = (params?: IQueryParams): AxiosPromise<IDept[]> =>
  request({
    method: 'get',
    url: '/department/list',
    params
  })

/**
 * 获取除某个部门以及其所有子孙部门的列表
 * @param {number} id
 */
export const getDeptListExclude = (id: number): AxiosPromise<IDept[]> =>
  request({
    method: 'get',
    url: `/department/list/exclude/${id}`
  })

/**
 * 新增部门
 * @param {ISaveDept} data
 */
export const addDept = (data: ISaveDept) =>
  request({
    method: 'post',
    url: '/department',
    data
  })

/**
 * 编辑部门
 * @param {ISaveDept} data
 */
export const editDept = (data: ISaveDept) =>
  request({
    method: 'put',
    url: '/department',
    data
  })

/**
 * 删除部门
 * @param {Number} id
 */
export const deleteDept = (id: number) =>
  request({
    method: 'delete',
    url: `/department/${id}`
  })
