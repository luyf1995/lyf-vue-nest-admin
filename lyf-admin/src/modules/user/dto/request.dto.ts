import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';
import { PartialType, OmitType, PickType } from '@nestjs/mapped-types';
import { PaginationDto } from 'src/common/dto/pagination.dto';

// 登录
export class LoginDto {
  @IsString()
  username: string;
  @IsString()
  password: string;
}

// 分页
export class PageQueryDto extends PaginationDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  departmentId?: string;

  @IsString()
  @IsOptional()
  roleId?: string;
}

// 创建用户
export class CreateUserDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  @MinLength(2, { message: '用户名至少2个字符' })
  @MaxLength(20, { message: '用户名做多不能超过20个字符' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: '姓名不能为空' })
  nickname: string;

  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(2, { message: '密码至少2个字符' })
  @MaxLength(20, { message: '密码最多不能超过20个字符' })
  password: string;

  @IsString()
  confirmPassword?: string;

  @IsNumber()
  @IsNotEmpty({ message: '状态不能为空' })
  status: number;

  @IsOptional()
  departmentId?: number | string; // 部门ID

  @IsArray()
  @IsOptional()
  roleId?: number[]; // 角色ID数组

  @IsNumber()
  @IsOptional()
  sex?: number; // 性别

  @IsString()
  @IsOptional()
  phoneNumber?: string;
}

// 编辑用户
export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), [
  'password',
  'confirmPassword'
]) {
  @IsNumber()
  id: number;
}
// 启用/停用
export class ChangeStatusDto extends PickType(CreateUserDto, ['status']) {
  @IsNumber()
  id: number;
}
// 重置密码
export class ResetPasswordDto extends PickType(CreateUserDto, [
  'password',
  'confirmPassword'
]) {
  @IsNumber()
  id: number;
}
