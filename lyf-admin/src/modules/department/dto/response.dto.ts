import { ApiProperty } from '@nestjs/swagger';

export class DeptDto {
  @ApiProperty({ description: 'ID' })
  id: number;

  @ApiProperty({ description: '部门名称' })
  name: string;

  @ApiProperty({ description: '排序' })
  sort: number;

  @ApiProperty({ description: '父部门ID' })
  parentId: number;

  @ApiProperty({ description: '创建时间' })
  createTime: Date;

  @ApiProperty({ description: '编辑时间' })
  updateTime: Date;

  @ApiProperty({ description: '删除标识' })
  isDelete: boolean;
}
