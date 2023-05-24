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
