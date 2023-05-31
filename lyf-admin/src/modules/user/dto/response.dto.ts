import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { SexEnum, StatusEnum } from '../utils';
import { DeptDto } from 'src/modules/department/dto/response.dto';
import { RoleDto } from 'src/modules/role/dto/response.dto';

// 登录
export class LoginResDto {
  token: string;
}

export class UserDto {
  @ApiProperty({ description: 'ID' })
  id: number;

  @ApiProperty({ description: '用户名' })
  username: string;

  @ApiProperty({ description: '姓名' })
  nickname: string;

  @ApiProperty({ description: '电话号码' })
  phoneNumber: string;

  @ApiProperty({ description: '性别', enum: SexEnum })
  sex: SexEnum;

  @ApiProperty({ description: '状态', enum: StatusEnum })
  status: StatusEnum;

  @ApiProperty({ description: '部门信息' })
  department: DeptDto;

  @ApiProperty({
    description: '角色信息',
    type: 'array',
    items: { $ref: getSchemaPath(RoleDto) }
  })
  roles: RoleDto;

  @ApiProperty({ description: '创建时间' })
  createTime: Date;

  @ApiProperty({ description: '编辑时间' })
  updateTime: Date;
}

// 当前系统用户信息
export class CurrentUserDto extends UserDto {
  @ApiProperty({
    description: '权限标识集合',
    type: 'array',
    items: { type: 'string' }
  })
  permissions: string[];
}
