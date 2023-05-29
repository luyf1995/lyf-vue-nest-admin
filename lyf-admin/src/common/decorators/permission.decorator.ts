import { SetMetadata } from '@nestjs/common';
import { PERMISSION_KEY } from '../constants/decorator.constant';

export interface PermissionData {
  permissions: string[];
  strategy: PermissionStrategyEnum;
}

// 权限策略
export enum PermissionStrategyEnum {
  OR = 1, // 或
  AND = 2 // 且
}

export const Permission = (
  permissions: string | string[],
  strategy = PermissionStrategyEnum.OR
) => {
  const permissionData: PermissionData = {
    permissions: [],
    strategy
  };

  if (typeof permissions === 'string') {
    permissionData.permissions = [permissions];
  } else if (Array.isArray(permissions)) {
    permissionData.permissions = permissions;
  }

  return SetMetadata(PERMISSION_KEY, permissionData);
};
