import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsNumber,
  IsOptional
} from 'class-validator';

// 查询
export class ListQueryDto {
  @ApiPropertyOptional({ description: '角色名称' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '角色标识' })
  @IsOptional()
  @IsString()
  code?: string;
}

export class CreateRoleDto {
  @ApiProperty({ description: '角色名称' })
  @IsString()
  @IsNotEmpty({
    message: '角色名称不能为空'
  })
  @MaxLength(255, {
    message: '角色名称最多不能超过255个字符'
  })
  name: string;

  @ApiProperty({ description: '角色标识' })
  @MaxLength(255, {
    message: '角色标识最多不能超过255个字符'
  })
  @IsNotEmpty({
    message: '角色标识不能为空'
  })
  code: string;

  @ApiPropertyOptional({ description: '排序' })
  @IsNumber()
  @IsOptional()
  sort: number;

  @ApiPropertyOptional({ description: '权限ID数组' })
  @IsArray()
  permissions?: number[];
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @ApiProperty({ description: 'ID' })
  @IsNumber()
  @IsNotEmpty({
    message: '角色ID不能为空'
  })
  id: number;
}
