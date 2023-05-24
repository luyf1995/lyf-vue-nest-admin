import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsNumber,
  Min,
  IsOptional
} from 'class-validator';

// 查询
export class ListQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;
}

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty({
    message: '角色名称不能为空'
  })
  @MaxLength(255, {
    message: '角色名称最多不能超过255个字符'
  })
  name: string;

  @MaxLength(255, {
    message: '角色标识最多不能超过255个字符'
  })
  code: string;

  @Min(0)
  @IsNumber()
  sort: number;

  @IsArray()
  permissions?: number[];
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsNumber()
  @IsNotEmpty({
    message: '角色ID不能为空'
  })
  id: number;
}
