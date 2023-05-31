import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

// 分页请求DTO
export class PaginationDto {
  @ApiProperty({ description: '当前页码' })
  @IsOptional()
  @Type()
  @IsNumber()
  pageNum?: number;

  @ApiProperty({ description: '每页条数' })
  @IsOptional()
  @Type()
  @IsNumber()
  pageSize?: number;

  // sql忽略条数
  skip?: number;
  // sql返回条数
  take?: number;
}
