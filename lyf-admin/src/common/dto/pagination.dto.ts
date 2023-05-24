import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  // 当前页
  @IsOptional()
  @Type()
  @IsNumber()
  pageNum?: number;

  // 每页条数
  @IsOptional()
  @Type()
  @IsNumber()
  pageSize?: number;

  // sql忽略条数
  skip?: number;
  // sql返回条数
  take?: number;
}
