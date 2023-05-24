// 业务状态码
export enum Code {
  SUCCCESS = 0,
  ERROR = 1,
  UNAUTHORIZED = 401 // token失效
}

export interface IResponse<T = any> {
  code: number
  message: string
  data: T
}
