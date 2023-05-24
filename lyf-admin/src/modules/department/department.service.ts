import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeptDto, ListQueryDto, UpdateDeptDto } from './dto/request.dto';
import { ApiException } from 'src/common/exceptions/api-exception';
import { UtilsService } from '../shared/utils.service';

@Injectable()
export class DepartmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService
  ) {}

  /**
   * 通过id获取部门信息
   * @param {number} id
   */
  async getDeptById(id: number) {
    return await this.prisma.department.findFirst({
      where: {
        AND: [{ id }, { isDelete: false }]
      }
    });
  }

  /**
   * 通过名称和父部门id获取部门信息
   * @param {string} name
   * @param {number|undefined|null} parentId
   */
  async getDeptByNameAndParentId(name: string, parentId?: number) {
    return this.prisma.department.findFirst({
      where: {
        AND: [{ name }, { parentId }, { isDelete: false }]
      }
    });
  }

  /**
   * 获取部门列表
   * @param {ListQueryDto} query
   */
  async getDeptList(query?: ListQueryDto) {
    return await this.prisma.department.findMany({
      where: {
        AND: [
          {
            name: this.utils.isEmpty(query?.name)
              ? undefined
              : { contains: query.name }
          },
          { isDelete: false }
        ]
      },
      orderBy: [{ sort: 'asc' }, { updateTime: 'desc' }]
    });
  }

  /**
   * 获取除某个部门以及其所有子孙部门的列表
   * @param {number} id
   */
  async getDeptListExclude(id) {
    const deptList = await this.getDeptList();
    return this.utils.arrayToTree(deptList || [], { excludeId: id });
  }

  /**
   * 创建部门
   */
  async createDept(createDeptDto: CreateDeptDto) {
    // 同一个父部门下不能有重名的子部门
    const dept = await this.getDeptByNameAndParentId(
      createDeptDto.name,
      createDeptDto.parentId
    );
    if (dept) {
      throw new ApiException('部门名称已存在！');
    }

    // 校验父部门
    const parentDept = await this.getDeptById(createDeptDto.parentId);
    if (createDeptDto.parentId !== 0 && !parentDept) {
      throw new ApiException('父部门不存在！');
    }

    return await this.prisma.department.create({
      data: createDeptDto
    });
  }

  /**
   * 编辑部门
   */
  async updateDept(updateDeptDto: UpdateDeptDto) {
    const dept = await this.getDeptById(updateDeptDto.id);
    if (!dept) {
      throw new ApiException('部门信息不存在');
    }
    return this.prisma.department.update({
      where: { id: updateDeptDto.id },
      data: updateDeptDto
    });
  }

  /**
   * 删除部门
   * @param {Number} id
   */
  async deleteDept(id: number) {
    const dept = await this.prisma.department.findUnique({
      where: { id }
    });
    if (!dept) {
      throw new ApiException('部门不存在！');
    }

    // 校验当前部门下是否有子部门
    const childs = await this.prisma.department.findMany({
      where: { parentId: id }
    });
    if (childs.length > 0) {
      throw new ApiException('当前部门下存在子部门，不可删除！');
    }

    // 校验是否有用户绑定了当前部门

    return await this.prisma.department.update({
      where: {
        id
      },
      data: {
        isDelete: true
      }
    });
  }
}
