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

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  /**
   * 获取部门列表
   */
  @Get('list')
  @Permission('system:dept:query')
  async getDeptList(@Query() query: ListQueryDto) {
    return await this.departmentService.getDeptList(query);
  }

  /**
   * 获取除某个部门以及其所有子孙部门的列表
   */
  @Get('list/exclude/:id')
  @Permission('system:dept:query')
  async getDeptListExclude(@Param('id') id: number) {
    return await this.departmentService.getDeptListExclude(id);
  }

  /**
   * 创建部门
   * @param {CreateDeptDto} createDeptDto
   */
  @Post()
  @Permission('system:dept:add')
  async createDept(@Body() createDeptDto: CreateDeptDto) {
    return await this.departmentService.createDept(createDeptDto);
  }

  /**
   * 编辑部门
   * @param {UpdateDeptDto} updateDeptDto
   */
  @Put()
  @Permission('system:dept:edit')
  async updateDept(@Body() updateDeptDto: UpdateDeptDto) {
    return await this.departmentService.updateDept(updateDeptDto);
  }

  /**
   * 删除部门
   * @param {Number} id
   */
  @Delete(':id')
  @Permission('system:dept:delete')
  async deleteDept(@Param('id') id: number) {
    return await this.departmentService.deleteDept(id);
  }
}
