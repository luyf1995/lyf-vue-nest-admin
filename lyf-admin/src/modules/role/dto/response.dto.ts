import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

// 角色列表
export class RoleDto implements Role {
  @ApiProperty({ description: 'ID' })
  id: number;

  @ApiProperty({ description: '角色名称' })
  name: string;

  @ApiProperty({ description: '角色标识' })
  code: string;

  @ApiProperty({ description: '排序' })
  sort: number;

  @ApiProperty({ description: '创建时间' })
  createTime: Date;

  @ApiProperty({ description: '编辑时间' })
  updateTime: Date;
}
