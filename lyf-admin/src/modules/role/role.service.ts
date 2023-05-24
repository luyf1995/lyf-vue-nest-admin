import { Injectable } from '@nestjs/common';
import { ApiException } from 'src/common/exceptions/api-exception';
import { CreateRoleDto, ListQueryDto, UpdateRoleDto } from './dto/request.dto';
import { UtilsService } from '../shared/utils.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ADMIN_ROLE } from './utils';

@Injectable()
export class RoleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService
  ) {}
  /**
   * 初始化管理员角色
   */
  async initAdminRole() {
    const admin = await this.getRoleByCode(ADMIN_ROLE.code);
    if (!admin) {
      this.createRole(ADMIN_ROLE);
    }
  }
  /**
   * 是否是系统管理员角色
   * @param {number} id
   */
  isAdminRole(id: number) {
    return ADMIN_ROLE.id === id;
  }

  /**
   * 查询所有角色
   * @param {ListQueryDto} query
   */
  async getAllRoleList(query: ListQueryDto) {
    return this.prisma.role.findMany({
      where: {
        AND: [
          {
            name: this.utils.isEmpty(query.name)
              ? undefined
              : { contains: query.name }
          },
          {
            code: this.utils.isEmpty(query.code)
              ? undefined
              : { contains: query.code }
          }
        ]
      },
      orderBy: [{ sort: 'asc' }, { updateTime: 'desc' }]
    });
  }

  /**
   * 通过code查询角色信息
   * @param {String} code
   */
  async getRoleByCode(code: string) {
    return this.prisma.role.findUnique({
      where: {
        code
      }
    });
  }
  /**
   * 通过id查询角色信息
   * @param {Number} id
   */
  async getRoleById(id: number) {
    return await this.prisma.role.findUnique({
      where: {
        id
      }
    });
  }

  /**
   * 通过id查询角色详细信息
   */
  async getRoleDetailById(id: number) {
    const role = await this.prisma.role.findUnique({ where: { id } });

    const permissions = await this.getPermissionsByRoleId(id);

    return {
      ...role,
      permissions
    };
  }

  /**
   * 通过单个角色id获取权限
   * @param {Number} roleId
   */
  async getPermissionsByRoleId(roleId: number) {
    // admin获取所有权限
    const whereQuery: Prisma.PermissionFindManyArgs =
      roleId === ADMIN_ROLE.id
        ? {}
        : {
            where: {
              rolePermissions: {
                some: {
                  roleId
                }
              }
            }
          };

    return await this.prisma.permission.findMany(whereQuery);
  }
  /**
   * 通过单多个角色id获取权限
   * @param {Number} roleId
   */
  async getPermissionsByRoleIds(roleIds: number[]) {
    // admin获取所有权限
    const whereQuery: Prisma.PermissionFindManyArgs = roleIds.includes(
      ADMIN_ROLE.id
    )
      ? {}
      : {
          where: {
            rolePermissions: {
              some: {
                roleId: {
                  in: roleIds
                }
              }
            }
          }
        };

    return await this.prisma.permission.findMany(whereQuery);
  }

  /**
   * 批量插入角色和权限的关联数据
   * @param {Number} roleId
   * @param {Array} permissionIds
   */
  async createRolePermission(roleId, permissionIds) {
    const rolePermissions = permissionIds.map((item) => {
      return {
        roleId: roleId,
        permissionId: item
      };
    });

    return await this.prisma.rolePermission.createMany({
      data: rolePermissions
    });
  }
  /**
   * 通过角色id删除关联表中的数据
   * @param {Number} roleId
   */
  async deleteRolePermissionByRoleId(roleId: number) {
    return await this.prisma.rolePermission.deleteMany({
      where: {
        roleId
      }
    });
  }

  /**
   * 创建角色
   * @param {CreateRoleDto} createRoleDto
   */
  async createRole(createRoleDto: CreateRoleDto) {
    const hasRole = await this.getRoleByCode(createRoleDto.code);
    if (hasRole) {
      throw new ApiException('角色标识已存在！');
    }

    const permissions = createRoleDto.permissions;
    delete createRoleDto.permissions;

    const roleCreateInput: Prisma.RoleCreateInput = createRoleDto;

    // 关联表中插入数据
    if (Array.isArray(permissions) && permissions.length > 0) {
      roleCreateInput.rolePermissions = {
        createMany: {
          data: permissions.map((item) => {
            return {
              permissionId: item
            };
          })
        }
      };
    }

    await this.prisma.role.create({
      data: roleCreateInput
    });
  }
  /**
   * 编辑角色
   * @param {UpdateRoleDto} updateRoleDto
   */
  async updateRole(updateRoleDto: UpdateRoleDto) {
    if (this.isAdminRole(updateRoleDto.id)) {
      throw new ApiException('系统管理员角色不允许修改！');
    }

    const hasRole = await this.getRoleById(updateRoleDto.id);
    if (!hasRole) {
      throw new ApiException('角色不存在！');
    }

    //权限
    const rolePermissions = (updateRoleDto.permissions || []).map((item) => {
      return {
        permissionId: item
      };
    });

    await this.prisma.role.update({
      where: {
        id: updateRoleDto.id
      },
      data: {
        name: updateRoleDto.name,
        code: updateRoleDto.code,
        sort: updateRoleDto.sort,
        rolePermissions: {
          deleteMany: {
            // 删除原有权限
            roleId: updateRoleDto.id
          },
          createMany: {
            // 插入新权限
            data: rolePermissions
          }
        }
      },
      include: {
        rolePermissions: true
      }
    });
  }
  /**
   * 删除角色
   * @param {Number} id
   */
  async deleteRole(id: number) {
    if (this.isAdminRole(id)) {
      throw new ApiException('系统管理员角色不允许删除！');
    }

    const role = await this.getRoleById(id);
    if (!role) {
      throw new ApiException('角色不存在！');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        AND: [
          {
            isDelete: false
          },
          {
            userRole: {
              some: {
                roleId: id
              }
            }
          }
        ]
      }
    });
    if (user) {
      throw new ApiException('当前角色已被用户绑定，请取消绑定后再尝试删除！');
    }

    //  删除关联表中的数据
    await this.deleteRolePermissionByRoleId(id);

    await this.prisma.role.delete({
      where: {
        id
      }
    });
  }
}
