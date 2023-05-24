// 业务状态码
export enum ResponseStatusEnum {
  SUCCESS = 0,
  ERROR = 1,
  FORBIDDEN = 401
}

export class ResponseResult<T> {
  readonly code: number;
  readonly data: T;
  readonly message: string;

  constructor(code: number, data?: any, message = 'success') {
    this.code = code;
    this.data = data;
    this.message = message;
  }
  static success(data?: any, message = 'success') {
    return new ResponseResult(ResponseStatusEnum.SUCCESS, data, message);
  }
  static error(message = 'error', code = ResponseStatusEnum.ERROR) {
    return new ResponseResult(code, null, message);
  }
}
