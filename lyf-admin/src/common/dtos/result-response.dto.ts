import { ApiProperty } from '@nestjs/swagger';

// 业务状态码
export enum ResponseStatusEnum {
  SUCCESS = 0,
  ERROR = 1,
  FORBIDDEN = 401
}

export class ResponseResultDto<T> {
  @ApiProperty({ description: '状态码', default: 0 })
  readonly code: number;

  @ApiProperty({ description: '信息', default: 'success' })
  readonly message: string;

  readonly data: T;

  constructor(code: number, data?: any, message = 'success') {
    this.code = code;
    this.data = data;
    this.message = message;
  }
  static success(data?: any, message = 'success') {
    return new ResponseResultDto(ResponseStatusEnum.SUCCESS, data, message);
  }
  static error(message = 'error', code = ResponseStatusEnum.ERROR) {
    return new ResponseResultDto(code, null, message);
  }
}
