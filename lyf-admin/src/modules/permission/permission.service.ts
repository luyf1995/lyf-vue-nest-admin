import { Injectable } from '@nestjs/common';
import { ApiException } from 'src/common/exceptions/api-exception';
import { PrismaService } from '../prisma/prisma.service';
import {
  ListQueryDto,
  CreatePermissionDto,
  UpdatePermissionDto
} from './dto/request.dto';
import { UtilsService } from '../shared/utils.service';
import { PermissionTypeEnum } from './utils';
import { omit } from 'lodash';

@Injectable()
export class PermissionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService
  ) {}

  /**
   * 获取权限列表
   * @param {ListQueryDto} query
   */
  async getPermissionList(query: ListQueryDto) {
    const permissionLists = await this.prisma.permission.findMany({
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
      orderBy: [
        {
          sort: 'asc'
        },
        {
          createTime: 'asc'
        }
      ]
    });
    return permissionLists;
  }

  /**
   * 通过权限id获取权限信息
   * @param {Number} id
   */
  async getPermissionById(id: number) {
    return await this.prisma.permission.findUnique({
      where: {
        id
      }
    });
  }

  /**
   * 通过权限code获取权限信息
   * @param {String} code
   */
  async getPermissionByCode(code: string) {
    return await this.prisma.permission.findUnique({
      where: {
        code
      }
    });
  }

  /**
   * 创建权限
   * @param {CreatePermissionDto} createPermissionDto
   */
  async createPermission(createPermissionDto: CreatePermissionDto) {
    const permission = await this.getPermissionByCode(createPermissionDto.code);
    if (permission && !this.utils.isEmpty(createPermissionDto.code)) {
      throw new ApiException('权限标识已存在！');
    }
    if (createPermissionDto.type === PermissionTypeEnum.DIRECTORY) {
      // 目录权限
      createPermissionDto = omit(createPermissionDto, 'code');
    }
    return await this.prisma.permission.create({
      data: createPermissionDto
    });
  }

  /**
   * 编辑权限
   * @param {CreatePermissionDto} createPermissionDto
   */
  async updatePermission(updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.getPermissionById(updatePermissionDto.id);
    if (!permission) {
      throw new ApiException('权限不存在！');
    }
    return await this.prisma.permission.update({
      data: updatePermissionDto,
      where: {
        id: updatePermissionDto.id
      }
    });
  }
  /**
   * 删除权限
   * @param {Number} id
   */
  async deletePermission(id: number) {
    const permission = await this.getPermissionById(id);
    if (!permission) {
      throw new ApiException('权限不存在！');
    }
    // 获取所有以当前权限为id或parentId的权限数据
    const permissions = await this.prisma.permission.findMany({
      select: {
        id: true
      },
      where: {
        OR: [{ id }, { parentId: id }]
      }
    });

    const permissionIds = permissions.map((item) => item.id);

    // 删除关联表中的数据
    const deleteRolePermission = this.prisma.rolePermission.deleteMany({
      where: {
        permissionId: {
          in: permissionIds
        }
      }
    });

    // 删除permission表中id、parentId匹配项
    const deletePermission = this.prisma.permission.deleteMany({
      where: {
        id: {
          in: permissionIds
        }
      }
    });

    const transaction = await this.prisma.$transaction([
      deleteRolePermission,
      deletePermission
    ]);

    return transaction;
  }
}
