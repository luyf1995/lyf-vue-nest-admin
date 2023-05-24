import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ListQueryDto {
  @IsString()
  @IsOptional()
  readonly name?: string;
}

export class CreateDeptDto {
  @IsString()
  @IsNotEmpty({
    message: '部门名称不能为空'
  })
  readonly name: string; // 部门名称

  @IsNumber()
  @IsOptional()
  sort: number; // 排序

  @IsNumber()
  @Transform(({ value }) => (value === '' ? 0 : +value))
  parentId: number; // 父部门ID
}

export class UpdateDeptDto extends PartialType(CreateDeptDto) {
  @IsNumber()
  @IsNotEmpty({
    message: 'id不能为空'
  })
  id: number;
}
