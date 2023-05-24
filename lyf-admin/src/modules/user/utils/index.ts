import { ADMIN_ROLE } from 'src/modules/role/utils';

export enum SexEnum {
  MALE = 1, // 男
  FEMALE = 2, // 女
  UNKNOWN = 3 // 未知
}

export enum StatusEnum {
  NORMAL = 1, // 正常
  STOP = 2 // 停用
}

// 管理员用户
export const ADMIN_USER = {
  id: 0,
  username: 'admin',
  password: 'admin',
  confirmPassword: 'admin',
  nickname: '系统管理员',
  status: StatusEnum.NORMAL,
  roleId: [ADMIN_ROLE.id]
};
