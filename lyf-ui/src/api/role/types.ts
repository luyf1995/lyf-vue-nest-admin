import { IPermission } from '../permission/types'

export interface IRole {
  id: number
  name: string // 名称
  code: string // 标识
  sort: number // 排序
  createTime: string // 创建时间
  updateTime: string // 编辑时间
}

// 详情
export interface IRoleDetail extends IRole {
  permissions: IPermission[]
}

// 新增、编辑
export interface ISaveRole extends Pick<IRole, 'name' | 'code' | 'sort'> {
  id?: number
  permissions: number[] // 权限id集合
}

// 查询参数
export interface IQueryParams {
  name?: string // 名称
  code?: string // 标识
}
