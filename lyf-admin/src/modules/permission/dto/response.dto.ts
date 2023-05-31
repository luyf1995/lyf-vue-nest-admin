import { ApiProperty } from '@nestjs/swagger';
import { PermissionTypeEnum } from '../utils';

export class PermissionDto {
  @ApiProperty({ description: 'ID' })
  id: number;

  @ApiProperty({ description: '权限名称' })
  name: string;

  @ApiProperty({ description: '权限标识' })
  code: string;

  @ApiProperty({ description: '权限类型', enum: PermissionTypeEnum })
  type: PermissionTypeEnum;

  @ApiProperty({ description: '父权限ID' })
  parentId: number;

  @ApiProperty({ description: '排序' })
  sort: number;

  @ApiProperty({ description: '创建时间' })
  createTime: Date;

  @ApiProperty({ description: '编辑时间' })
  updateTime: Date;
}
