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
import { PermissionService } from './permission.service';
import {
  ListQueryDto,
  CreatePermissionDto,
  UpdatePermissionDto
} from './dto/request.dto';
import { Permission } from 'src/common/decorators/permission.decorator';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  /**
   * 获取所有权限
   * @param {ListQueryDto} query
   */
  @Get('list')
  @Permission('system:permission:query')
  async getPermissionList(@Query() query: ListQueryDto) {
    return this.permissionService.getPermissionList(query);
  }

  /**
   *创建权限
   */
  @Post()
  @Permission('system:permission:add')
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.permissionService.createPermission(createPermissionDto);
  }

  /**
   * 编辑权限
   */
  @Put()
  @Permission('system:permission:edit')
  async updatePermission(@Body() updatePermissionDto: UpdatePermissionDto) {
    return await this.permissionService.updatePermission(updatePermissionDto);
  }

  /**
   * 删除权限
   */
  @Delete(':id')
  @Permission('system:permission:delete')
  async deletePermission(@Param('id') id: number) {
    return await this.permissionService.deletePermission(id);
  }
}
