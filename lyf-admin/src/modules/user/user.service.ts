import { Injectable } from '@nestjs/common';
import { omit } from 'lodash';
import {
  ChangeStatusDto,
  CreateUserDto,
  PageQueryDto,
  ResetPasswordDto,
  UpdateUserDto
} from './dto/request.dto';

import { ApiException } from 'src/common/exceptions/api-exception';
import { PrismaService } from '../prisma/prisma.service';
import { DepartmentService } from '../department/department.service';
import { UtilsService } from '../shared/utils.service';
import { BcryptService } from '../shared/bcrypt.service';
import { Prisma } from '@prisma/client';
import { RoleService } from '../role/role.service';
import { ADMIN_USER_ID } from 'src/common/constants/admin.constant';

/**
 * 通过部门id找寻所有子孙部门id
 * @param {number} deptId
 * @param {array} departments
 * @return {array}
 */
function findChildDepartments(deptId, departments) {
  let result = [];
  for (let i = 0; i < departments.length; i++) {
    const dept = departments[i];
    if (dept.parentId === deptId) {
      result.push(dept.id);
      result = result.concat(findChildDepartments(dept.id, departments));
    }
  }
  return result;
}

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly departmentService: DepartmentService,
    private readonly roleService: RoleService,
    private readonly utils: UtilsService,
    private readonly bcrypt: BcryptService
  ) {}
  /**
   * 是否是系统管理员用户
   * @param {number} id
   */
  isAdminUser(id: number) {
    return id === ADMIN_USER_ID;
  }
  /**
   * 获取当前用户信息
   * @param {Number} id 用户id
   */
  async getCurrentUserInfo(id: number) {
    const userInfo = await this.getUserDetailById(id);

    const roleIds = userInfo.roles.map((item) => item.id);

    const permissions = await this.roleService.getPermissionsByRoleIds(
      roleIds || []
    );

    userInfo.permissions = permissions.map((item) => item.code);

    return userInfo;
  }

  /**
   * 获取用户列表
   */
  async getUserListByPage({
    skip,
    take,
    username = '',
    nickname = '',
    status = '',
    departmentId = '',
    roleId = ''
  }: PageQueryDto = {}) {
    // 查询参数
    const whereQuery = {
      AND: [
        {
          isDelete: false
        },
        {
          username: this.utils.isEmpty(username)
            ? undefined
            : { contains: username }
        },
        {
          nickname: this.utils.isEmpty(nickname)
            ? undefined
            : { contains: nickname }
        },
        {
          status: this.utils.isEmpty(status) ? undefined : parseInt(status)
        },
        {
          userRole: this.utils.isEmpty(roleId)
            ? undefined
            : { some: { roleId: parseInt(roleId) } }
        }
      ]
    };

    // 部门查询参数
    const deptQuery: any = {
      departmentId: undefined
    };
    if (!this.utils.isEmpty(departmentId)) {
      // 获取所有部门
      const parseDeptId = parseInt(departmentId);
      const allDeptList = await this.departmentService.getDeptList();
      // 获取当前部门所有子孙部门id
      const childDepartmentIds = [
        parseDeptId,
        ...findChildDepartments(parseDeptId, allDeptList)
      ];
      deptQuery.departmentId = {
        in: childDepartmentIds
      };
    }

    whereQuery.AND.push(deptQuery);

    const users = await this.prisma.user.findMany({
      take,
      skip,
      where: whereQuery,
      include: {
        department: true,
        userRole: {
          include: {
            role: true
          }
        }
      },
      orderBy: [
        {
          createTime: 'desc'
        }
      ]
    });

    const list = users.map((item) => {
      let user: any = Object.assign({}, item);
      user.roles = (user.userRole || []).map((ur) => ur.role);

      user = omit(user, ['isDelete', 'userRole', 'password']);

      return user;
    });

    const count = await this.prisma.user.count({ where: whereQuery });
    return {
      list,
      total: count
    };
  }

  /**
   * 通过id获取用户详细信息
   * @param {Number} id
   */
  async getUserDetailById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      },
      include: {
        department: true,
        userRole: {
          include: {
            role: true
          }
        }
      }
    });
    let detail: any = Object.assign({}, user);

    detail.roles = (user.userRole || []).map((ur) => ur.role);

    detail = omit(detail, ['isDelete', 'userRole', 'password']);

    return detail;
  }
  /**
   * 通过id获取用户信息
   * @param {Number} id
   */
  async getUserById(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id
      }
    });
  }
  /**
   * 通过username获取用户信息
   * @param {String} username
   */
  async getUserByUsername(username: string) {
    return await this.prisma.user.findUnique({
      where: {
        username
      }
    });
  }

  /**
   * 校验用户
   * @param {number} id
   */
  async validateUser(id) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new ApiException('用户不存在！');
    }
    return user;
  }

  /**
   * 校验部门信息
   * @param {number} deptId
   */
  async validateDept(deptId: number | string) {
    const dept = await this.departmentService.getDeptById(deptId as number);

    if (!dept) {
      throw new ApiException(`部门信息不存在！`);
    }
    return dept;
  }
  /**
   * 校验角色信息
   * @param {array} roleIds
   */
  async validateRoles(roleIds: number[]) {
    const roles = await this.prisma.role.findMany({
      where: {
        id: {
          in: roleIds
        }
      }
    });

    // 合法的角色Id数组
    const validRoleIds = roles.map((item) => item.id);
    // 非法的角色Id数组
    const invalidRoleIds = roleIds.filter(
      (item) => !validRoleIds.includes(item)
    );
    if (invalidRoleIds.length > 0) {
      throw new ApiException(`角色信息不存在，ID: ${invalidRoleIds.join(',')}`);
    }
  }
  /**
   * 创建用户
   * @param {CreateUserDto} createUserDto
   */
  async createUser(createUserDto: CreateUserDto) {
    const deptId = createUserDto.departmentId;
    const roleIds = createUserDto.roleId;

    if (createUserDto.password !== createUserDto.confirmPassword)
      throw new ApiException('两次输入密码不一致，请重试！');

    if (await this.getUserByUsername(createUserDto.username))
      throw new ApiException(`用户名已存在！`);

    const userCreateInput: any = {
      id: createUserDto.id, // 初始创建admin用户时需要用到
      username: createUserDto.username,
      nickname: createUserDto.nickname,
      phoneNumber: createUserDto.phoneNumber,
      sex: createUserDto.sex,
      status: createUserDto.status,
      password: ''
    };

    // 加密
    const hashedPwd = await this.bcrypt.hash(createUserDto.password);
    userCreateInput.password = hashedPwd;

    // 校验部门信息
    if (!this.utils.isEmpty(deptId)) {
      await this.validateDept(deptId);

      userCreateInput.department = {
        connect: {
          id: deptId as number
        }
      };
    }

    // 校验角色信息
    if (!this.utils.isEmpty(roleIds) && roleIds.length !== 0) {
      await this.validateRoles(roleIds);

      userCreateInput.userRole = {
        createMany: {
          data: roleIds.map((item) => {
            return {
              roleId: item
            };
          })
        }
      };
    }

    return await this.prisma.user.create({
      data: userCreateInput
    });
  }
  /**
   * 修改用户
   * @param {UpdateUserDto} updateUserDto
   */
  async updateUser(updateUserDto: UpdateUserDto) {
    if (this.isAdminUser(updateUserDto.id)) {
      throw new ApiException('系统管理员用户不允许修改！');
    }

    const deptId = updateUserDto.departmentId;
    const roleIds = updateUserDto.roleId;

    await this.validateUser(updateUserDto.id);

    const userUpdateInput: Prisma.UserUpdateInput = {
      username: updateUserDto.username,
      nickname: updateUserDto.nickname,
      phoneNumber: updateUserDto.phoneNumber,
      sex: updateUserDto.sex,
      status: updateUserDto.status
    };

    // 校验部门信息
    if (!this.utils.isEmpty(deptId)) {
      await this.validateDept(deptId);

      userUpdateInput.department = {
        connect: {
          id: deptId as number
        }
      };
    } else if (deptId === '') {
      userUpdateInput.department = {
        disconnect: true
      };
    }

    // 校验角色信息
    if (!this.utils.isEmpty(roleIds) && Array.isArray(roleIds)) {
      // 清空角色关联数据
      userUpdateInput.userRole = {
        deleteMany: {
          userId: updateUserDto.id
        }
      };

      if (roleIds.length !== 0) {
        await this.validateRoles(roleIds);

        userUpdateInput.userRole.createMany = {
          data: roleIds.map((item) => {
            return {
              roleId: item
            };
          })
        };
      }
    }

    return await this.prisma.user.update({
      where: {
        id: updateUserDto.id
      },
      data: userUpdateInput
    });
  }
  /**
   * 删除用户
   * @param {number} id
   */
  async deleteUser(id: number) {
    if (this.isAdminUser(id)) {
      throw new ApiException('系统管理员用户不允许删除！');
    }

    await this.validateUser(id);

    await this.prisma.user.update({
      where: {
        id
      },
      data: {
        isDelete: true
      }
    });
  }
  /**
   * 启用/停用
   * @param {ChangeStatusDto} changeStatusDto
   */
  async changeStatus(changeStatusDto: ChangeStatusDto) {
    if (this.isAdminUser(changeStatusDto.id)) {
      throw new ApiException('系统管理员用户不允许修改！');
    }

    const user = await this.validateUser(changeStatusDto.id);

    if (user.status === changeStatusDto.status) {
      throw new ApiException('状态参数有误！');
    }

    return await this.prisma.user.update({
      where: {
        id: changeStatusDto.id
      },
      data: {
        status: changeStatusDto.status
      }
    });
  }
  /**
   * 重置密码
   * @param {ResetPasswordDto} resetPasswordDto
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    if (this.isAdminUser(resetPasswordDto.id)) {
      throw new ApiException('系统管理员用户不允许修改！');
    }

    await this.validateUser(resetPasswordDto.id);

    if (resetPasswordDto.password !== resetPasswordDto.confirmPassword)
      throw new ApiException('两次输入密码不一致，请重试！');

    const hashedPwd = await this.bcrypt.hash(resetPasswordDto.password);

    return await this.prisma.user.update({
      where: {
        id: resetPasswordDto.id
      },
      data: {
        password: hashedPwd
      }
    });
  }
}
