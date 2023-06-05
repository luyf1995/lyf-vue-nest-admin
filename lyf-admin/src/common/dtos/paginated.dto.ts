import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

// 分页结果DTO
export class PaginatedDto<T> {
  @ApiProperty({ description: '总条数' })
  total: number;

  @ApiHideProperty()
  list: T[];
}
