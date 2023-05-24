import { IDept } from '../dept/types'
import { IRole } from '../role/types'
import { IPageQuery } from '../common/types'

// 登录
export interface ILogin {
  username: string | number
  password: string | number
}
// 登录响应参数
export interface ILoginResult {
  token: string
}

export enum SexEnum {
  MALE = 1, // 男
  FEMALE = 2, // 女
  UNKNOWN = 3 // 未知
}

export enum StatusEnum {
  NORMAL = 1, // 正常
  STOP = 2 // 停用
}

export interface IUser {
  id: number
  username: string // 用户名
  nickname: string // 姓名
  department: IDept // 部门
  roles: IRole[] // 角色
  sex: SexEnum | string // 性别
  phoneNumber: number | string // 手机号码
  status: StatusEnum | string // 状态
  createTime: string // 创建时间
  updateTime: string // 编辑时间
}
// 详情
export type IUserDetail = IUser

// 新增、编辑
export interface ISaveUser extends Pick<IUser, 'username' | 'nickname' | 'sex' | 'phoneNumber' | 'status'> {
  id?: number
  password: string
  confirmPassword: string
  departmentId?: number | string
  roleId?: number[]
}

// 查询参数
export interface IQueryParams extends IPageQuery {
  departmentId?: number | string
  username?: string
  nickname?: string
  status?: number | string
  roleId?: number | string
}

// 启用/停用
export type IChangeStatus = Pick<IUser, 'id' | 'status'>
// 修改密码
export interface IChangePassword extends Pick<ISaveUser, 'password' | 'confirmPassword'> {
  id: number
}

// 登录后的用户信息
export interface IUserInfo extends IUser {
  permission: string[] // 权限
}

// 后端修改密码接口格式
export interface IPassword {
  oldPassword: string // 旧密码
  newPassword: string // 新密码
}
// 修改密码form
export interface IPasswordForm extends IPassword {
  confirmPassword: string // 确认密码
}
