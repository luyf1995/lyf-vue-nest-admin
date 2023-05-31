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
import { DepartmentService } from './department.service';
import { CreateDeptDto, UpdateDeptDto, ListQueryDto } from './dto/request.dto';
import { Permission } from 'src/common/decorators/permission.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { DeptDto } from './dto/response.dto';
import { ApiResultResponse } from 'src/common/decorators/api-result-response.decorator';

@ApiTags('部门管理')
@ApiBearerAuth()
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  /**
   * 获取部门列表
   */
  @ApiOperation({ summary: '获取部门列表' })
  @ApiResultResponse(DeptDto, { isArray: true })
  @Get('list')
  @Permission('system:dept:query')
  async getDeptList(@Query() query: ListQueryDto): Promise<DeptDto[]> {
    return await this.departmentService.getDeptList(query);
  }

  /**
   * 获取除某个部门以及其所有子孙部门的列表
   */
  @ApiOperation({ summary: '获取除某个部门以及其所有子孙部门的列表' })
  @ApiParam({ name: 'id', description: '部门ID' })
  @ApiResultResponse()
  @Get('list/exclude/:id')
  @Permission('system:dept:query')
  async getDeptListExclude(@Param('id') id: number): Promise<DeptDto[]> {
    return await this.departmentService.getDeptListExclude(id);
  }

  /**
   * 创建部门
   * @param {CreateDeptDto} createDeptDto
   */
  @ApiOperation({ summary: '创建部门' })
  @ApiResultResponse()
  @Post()
  @Permission('system:dept:add')
  async createDept(@Body() createDeptDto: CreateDeptDto) {
    await this.departmentService.createDept(createDeptDto);
  }

  /**
   * 编辑部门
   * @param {UpdateDeptDto} updateDeptDto
   */
  @ApiOperation({ summary: '编辑部门' })
  @ApiResultResponse()
  @Put()
  @Permission('system:dept:edit')
  async updateDept(@Body() updateDeptDto: UpdateDeptDto) {
    await this.departmentService.updateDept(updateDeptDto);
  }

  /**
   * 删除部门
   * @param {Number} id
   */
  @ApiOperation({ summary: '删除部门' })
  @ApiParam({ name: 'id', description: '部门ID' })
  @ApiResultResponse()
  @Delete(':id')
  @Permission('system:dept:delete')
  async deleteDept(@Param('id') id: number) {
    await this.departmentService.deleteDept(id);
  }
}
