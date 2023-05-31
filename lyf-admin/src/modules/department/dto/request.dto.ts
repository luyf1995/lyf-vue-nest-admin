import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ListQueryDto {
  @ApiPropertyOptional({ description: '部门名称' })
  @IsString()
  @IsOptional()
  readonly name?: string;
}

export class CreateDeptDto {
  @ApiProperty({ description: '部门名称' })
  @IsString()
  @IsNotEmpty({
    message: '部门名称不能为空'
  })
  readonly name: string;

  @ApiPropertyOptional({ description: '排序' })
  @IsNumber()
  @IsOptional()
  sort: number;

  @ApiProperty({ description: '父节点ID' })
  @IsNumber()
  @Transform(({ value }) => (value === '' ? 0 : +value))
  parentId: number;
}

export class UpdateDeptDto extends PartialType(CreateDeptDto) {
  @ApiProperty({ description: 'ID' })
  @IsNumber()
  @IsNotEmpty({
    message: 'id不能为空'
  })
  id: number;
}
