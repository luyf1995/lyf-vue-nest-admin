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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResultResponse } from 'src/common/decorators/api-result-response.decorator';
import { PermissionDto } from './dto/response.dto';
@ApiTags('权限管理')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  /**
   * 获取权限列表
   * @param {ListQueryDto} query
   */
  @ApiOperation({ summary: '获取权限列表' })
  @ApiResultResponse(PermissionDto, { isArray: true })
  @Get('list')
  @Permission('system:permission:query')
  async getPermissionList(
    @Query() query: ListQueryDto
  ): Promise<PermissionDto[]> {
    return this.permissionService.getPermissionList(query);
  }

  /**
   *创建权限
   */
  @ApiOperation({ summary: '创建权限' })
  @ApiResultResponse()
  @Post()
  @Permission('system:permission:add')
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    await this.permissionService.createPermission(createPermissionDto);
  }

  /**
   * 编辑权限
   */
  @ApiOperation({ summary: '编辑权限' })
  @ApiResultResponse()
  @Put()
  @Permission('system:permission:edit')
  async updatePermission(@Body() updatePermissionDto: UpdatePermissionDto) {
    await this.permissionService.updatePermission(updatePermissionDto);
  }

  /**
   * 删除权限
   */
  @ApiOperation({ summary: '删除权限' })
  @ApiResultResponse()
  @Delete(':id')
  @Permission('system:permission:delete')
  async deletePermission(@Param('id') id: number) {
    await this.permissionService.deletePermission(id);
  }
}
