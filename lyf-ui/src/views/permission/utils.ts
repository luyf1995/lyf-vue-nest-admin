import { PermissionTypeEnum } from '@/api/permission/types'

export const PERMISSION_TYPE_LIST = [
  {
    label: '目录',
    value: PermissionTypeEnum.DIRECTORY
  },
  {
    label: '菜单',
    value: PermissionTypeEnum.MENU
  },
  {
    label: '操作',
    value: PermissionTypeEnum.OPERATE
  }
]
