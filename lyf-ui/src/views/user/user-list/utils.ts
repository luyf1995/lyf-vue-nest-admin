import { StatusEnum, SexEnum } from '@/api/user/types'
// 状态list
export const STATUS_LIST = [
  {
    label: '正常',
    value: StatusEnum.NORMAL
  },
  {
    label: '停用',
    value: StatusEnum.STOP
  }
]
// 性别list
export const SEX_LIST = [
  {
    label: '男',
    value: SexEnum.MALE
  },
  {
    label: '女',
    value: SexEnum.FEMALE
  },
  {
    label: '未知',
    value: SexEnum.UNKNOWN
  }
]
