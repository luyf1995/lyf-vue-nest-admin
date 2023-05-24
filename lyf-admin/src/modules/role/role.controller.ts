import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto, ListQueryDto } from './dto/request.dto';
import { RoleService } from './role.service';
import { Permission } from 'src/common/decorators/permission.decorator';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {
    this.initAdminRole();
  }
  /**
   * 初始化管理员角色
   */
  async initAdminRole() {
    this.roleService.initAdminRole();
  }
  /**
   * 查询所有角色
   */
  @Get('list')
  @Permission('system:role:query')
  async getAllRoleList(@Query() query: ListQueryDto) {
    return await this.roleService.getAllRoleList(query);
  }

  /**
   * 创建角色
   * @param {CreateRoleDto} createRoleDto
   */
  @Post()
  @Permission('system:role:add')
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return await this.roleService.createRole(createRoleDto);
  }
  /**
   * 编辑角色
   * @param {UpdateRoleDto} updateRoleDto
   */
  @Put()
  @Permission('system:role:edit')
  async updateRole(@Body() updateRoleDto: UpdateRoleDto) {
    return await this.roleService.updateRole(updateRoleDto);
  }
  /**
   * 删除角色
   */
  @Delete(':id')
  @Permission('system:role:delete')
  async deleteRole(@Param('id') id: number) {
    return await this.roleService.deleteRole(id);
  }
  /**
   * 通过角色id获取角色详情
   */
  @Get(':id')
  @Permission('system:role:query')
  async getRoleDetailById(@Param('id') id: number) {
    return await this.roleService.getRoleDetailById(id);
  }
}
