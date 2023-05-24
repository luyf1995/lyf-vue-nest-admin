// 权限类型
export enum PermissionTypeEnum {
  DIRECTORY = 1, // 目录
  MENU = 2, // 菜单
  OPERATE = 3 // 操作
}
export interface IPermission {
  id: number
  name: string
  code: string
  type: PermissionTypeEnum
  parentId?: number | string
  sort: number
  createTime: string
  updateTime: string
  children?: IPermission[]
}

export type IQueryParams = Pick<Partial<IPermission>, 'name' | 'code'>

// 新增、编辑权限
export interface ISavePermission extends Pick<IPermission, 'name' | 'code' | 'type' | 'parentId' | 'sort'> {
  id?: number
}
