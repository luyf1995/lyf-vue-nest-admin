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
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export const UserRoleEnumName = {
  [PermissionTypeEnum.DIRECTORY]: '管理员',
  [PermissionTypeEnum.MENU]: '普通用户',
  [PermissionTypeEnum.OPERATE]: '访客'
};
export class ListQueryDto {
  @ApiPropertyOptional({ description: '权限名称' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ description: '权限标识' })
  @IsString()
  @IsOptional()
  code: string;
}

export class CreatePermissionDto {
  @ApiProperty({ description: '权限名称' })
  @IsString()
  @IsNotEmpty({
    message: '权限名称不能为空'
  })
  @MaxLength(255, {
    message: '权限名称最多不能超过255个字符'
  })
  name: string;

  @ApiPropertyOptional({ description: '权限标识' })
  @IsString()
  @IsOptional()
  code: string;

  @ApiProperty({ description: '父权限ID' })
  @IsNumber()
  @Transform(({ value }) => (value === '' ? 0 : +value))
  parentId: number;

  @ApiProperty({
    description: '权限类型',
    enum: PermissionTypeEnum,
    enumName: `目录: ${PermissionTypeEnum.DIRECTORY};菜单: ${PermissionTypeEnum.MENU};操作: ${PermissionTypeEnum.OPERATE}`
  })
  @IsNumber()
  @IsEnum(PermissionTypeEnum)
  type: PermissionTypeEnum;

  @ApiPropertyOptional({ description: '排序' })
  @IsNumber()
  @IsOptional()
  sort: number;
}

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @ApiProperty({ description: 'ID' })
  @IsNumber()
  @IsNotEmpty({
    message: '权限ID不能为空'
  })
  id: number;
}
