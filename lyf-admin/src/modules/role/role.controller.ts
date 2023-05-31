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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { RoleDto } from './dto/response.dto';
import { ApiResultResponse } from 'src/common/decorators/api-result-response.decorator';

@ApiTags('角色管理')
@ApiBearerAuth()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  /**
   * 查询角色列表
   */
  @ApiOperation({ summary: '查询角色列表' })
  @ApiResultResponse(RoleDto, { isArray: true })
  @Get('list')
  @Permission('system:role:query')
  async getRoleList(@Query() query: ListQueryDto): Promise<RoleDto[]> {
    return await this.roleService.getRoleList(query);
  }

  /**
   * 创建角色
   * @param {CreateRoleDto} createRoleDto
   */
  @ApiOperation({ summary: '创建角色' })
  @ApiResultResponse()
  @Post()
  @Permission('system:role:add')
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    await this.roleService.createRole(createRoleDto);
  }
  /**
   * 编辑角色
   * @param {UpdateRoleDto} updateRoleDto
   */
  @ApiOperation({ summary: '编辑角色' })
  @ApiResultResponse()
  @Put()
  @Permission('system:role:edit')
  async updateRole(@Body() updateRoleDto: UpdateRoleDto) {
    await this.roleService.updateRole(updateRoleDto);
  }
  /**
   * 删除角色
   */
  @ApiOperation({ summary: '删除角色' })
  @ApiParam({ name: 'id', description: 'ID' })
  @ApiResultResponse()
  @Delete(':id')
  @Permission('system:role:delete')
  async deleteRole(@Param('id') id: number) {
    await this.roleService.deleteRole(id);
  }
  /**
   * 通过角色id获取角色详情
   */
  @ApiOperation({ summary: '通过角色ID获取角色信息' })
  @ApiParam({ name: 'id', description: 'ID' })
  @ApiResultResponse(RoleDto)
  @Get(':id')
  @Permission('system:role:query')
  async getRoleDetailById(@Param('id') id: number): Promise<RoleDto> {
    return await this.roleService.getRoleDetailById(id);
  }
}
