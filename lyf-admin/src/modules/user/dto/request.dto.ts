import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  OmitType,
  PickType
} from '@nestjs/swagger';
import { SexEnum, StatusEnum } from '../utils';

// 登录
export class LoginDto {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString()
  username: string;

  @ApiProperty({ description: '密码' })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString()
  password: string;
}

// 分页
export class PageQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: '用户名' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({ description: '姓名' })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiPropertyOptional({ description: '状态' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: '部门ID' })
  @IsString()
  @IsOptional()
  departmentId?: string;

  @ApiPropertyOptional({ description: '角色ID' })
  @IsString()
  @IsOptional()
  roleId?: string;
}

// 创建用户
export class CreateUserDto {
  @ApiPropertyOptional({ description: 'ID' })
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiProperty({ description: '用户名' })
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  @MinLength(2, { message: '用户名至少2个字符' })
  @MaxLength(20, { message: '用户名做多不能超过20个字符' })
  username: string;

  @ApiProperty({ description: '姓名' })
  @IsString()
  @IsNotEmpty({ message: '姓名不能为空' })
  nickname: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(2, { message: '密码至少2个字符' })
  @MaxLength(20, { message: '密码最多不能超过20个字符' })
  password: string;

  @ApiProperty({ description: '确认密码' })
  @IsString()
  confirmPassword?: string;

  @ApiProperty({ description: '状态', enum: StatusEnum })
  @IsNumber()
  @IsNotEmpty({ message: '状态不能为空' })
  status: StatusEnum;

  @ApiPropertyOptional({ description: '部门ID', type: 'number' })
  @IsOptional()
  departmentId?: number | string;

  @ApiPropertyOptional({
    description: '角色ID数组',
    type: 'array',
    items: { type: 'number' }
  })
  @IsArray()
  @IsOptional()
  roleId?: number[];

  @ApiPropertyOptional({ description: '性别', enum: SexEnum })
  @IsNumber()
  @IsOptional()
  sex?: SexEnum;

  @ApiPropertyOptional({ description: '手机号码' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;
}

// 编辑用户
export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), [
  'password',
  'confirmPassword'
]) {
  @ApiProperty({ description: 'ID', required: true })
  @IsNumber()
  id: number;
}
// 启用/停用
export class ChangeStatusDto extends PickType(CreateUserDto, ['status']) {
  @ApiProperty({ description: 'ID', required: true })
  @IsNumber()
  id: number;
}
// 重置密码
export class ResetPasswordDto extends PickType(CreateUserDto, [
  'password',
  'confirmPassword'
]) {
  @ApiProperty({ description: 'ID', required: true })
  @IsNumber()
  id: number;
}
