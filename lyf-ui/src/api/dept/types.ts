export interface IDept {
  id: number
  name: string // 名称
  sort: number // 排序
  parentId: number | string // 父部门ID
  createTime: string // 创建时间
  updateTime: string // 编辑时间
  children?: IDept[]
}

export interface IDeptTree extends IDept {
  children: IDept[]
}

// 新增、编辑
export interface ISaveDept extends Pick<IDept, 'name' | 'sort' | 'parentId'> {
  id?: number
}

// 查询参数
export interface IQueryParams {
  name?: string // 名称
}
