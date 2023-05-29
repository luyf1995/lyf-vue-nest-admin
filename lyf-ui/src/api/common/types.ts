// 业务状态码
export enum Code {
  SUCCCESS = 0,
  ERROR = 1,
  UNAUTHORIZED = 401 // token失效
}

export interface IResponse<T> {
  code: number
  message: string
  data: T
}

// 新增、编辑弹框类型枚举
export enum DialogTypeEnum {
  ADD = 'add', // 新增
  EDIT = 'edit', // 编辑
  VIEW = 'view' // 查看
}

// 分页
export interface IPageQuery {
  pageNum: number // 页码
  pageSize: number // 每页数量
}

// 分页返回值
export interface IPageResult<T> extends IPageQuery {
  list: T
  total: number // 总数
}
