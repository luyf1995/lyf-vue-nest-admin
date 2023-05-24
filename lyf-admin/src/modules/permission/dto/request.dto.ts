import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PermissionTypeEnum } from '../utils/index';

export class ListQueryDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  code: string;
}

export class CreatePermissionDto {
  @IsString()
  @IsOptional()
  code: string; // 权限标识

  @IsString()
  @IsNotEmpty({
    message: '权限名称不能为空'
  })
  @MaxLength(255, {
    message: '权限名称最多不能超过255个字符'
  })
  name: string; // 权限名称

  @IsNumber()
  @Transform(({ value }) => (value === '' ? 0 : +value))
  parentId: number; //父节点ID

  @IsNumber()
  @IsEnum(PermissionTypeEnum)
  type: PermissionTypeEnum; // 权限类型

  @IsNumber()
  @IsOptional()
  sort: number; // 排序
}

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @IsNumber()
  @IsNotEmpty({
    message: '权限ID不能为空'
  })
  id: number;
}
