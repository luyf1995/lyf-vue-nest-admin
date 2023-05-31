import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UsePipes
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  PageQueryDto,
  ChangeStatusDto,
  ResetPasswordDto
} from './dto/request.dto';
import { PaginationPipe } from 'src/common/pipes/pagination.pipe';
import { Permission } from 'src/common/decorators/permission.decorator';
import { ApiResultResponse } from 'src/common/decorators/api-result-response.decorator';
import { CurrentUserDto, UserDto } from './dto/response.dto';
import { PaginatedDto } from 'src/common/dto/paginated.dto';

@ApiTags('用户管理')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 获取当前系统用户信息
   */
  @ApiOperation({ summary: '获取当前系统用户信息' })
  @ApiResultResponse(CurrentUserDto)
  @Get('/info')
  async getCurrentUserInfo(@Req() req): Promise<CurrentUserDto> {
    return await this.userService.getCurrentUserInfo(req.user.userId);
  }

  /**
   * 分页获取用户列表
   */
  @ApiOperation({ summary: '分页获取用户列表' })
  @ApiResultResponse(UserDto, { isPage: true })
  @Get('/list')
  @Permission('system:user:query')
  @UsePipes(PaginationPipe)
  async getUserListByPage(
    @Query() query: PageQueryDto
  ): Promise<PaginatedDto<UserDto>> {
    return await this.userService.getUserListByPage(query);
  }

  /**
   * 通过ID获取用户信息
   */
  @ApiOperation({ summary: '通过ID获取用户信息' })
  @ApiParam({ name: 'id', description: 'ID' })
  @ApiResultResponse(UserDto)
  @Get(':id')
  @Permission('system:user:query')
  async getUserDetailById(@Param('id') id: number): Promise<UserDto> {
    return await this.userService.getUserDetailById(id);
  }

  /**
   * 创建用户
   * @param {CreateUserDto} createUserDto
   */
  @ApiOperation({ summary: '创建用户' })
  @ApiResultResponse()
  @Post()
  @Permission('system:user:add')
  async createUser(@Body() createUserDto: CreateUserDto) {
    await this.userService.createUser(createUserDto);
  }

  /**
   * 编辑用户
   * @param {UpdateUserDto} updateUserDto
   */
  @ApiOperation({ summary: '编辑用户' })
  @ApiResultResponse()
  @Put()
  @Permission('system:user:edit')
  async updateUser(@Body() updateUserDto: UpdateUserDto) {
    await this.userService.updateUser(updateUserDto);
  }

  /**
   * 修改用户状态
   * @param {ChangeStatusDto} changeStatusDto
   */
  @ApiOperation({ summary: '用户启用/禁用' })
  @ApiResultResponse()
  @Put('change-status')
  @Permission('system:user:edit')
  async changeStatus(@Body() changeStatusDto: ChangeStatusDto) {
    await this.userService.changeStatus(changeStatusDto);
  }

  /**
   * 删除用户
   * @param {number} id
   */
  @ApiOperation({ summary: '删除用户' })
  @ApiParam({ name: 'id', description: 'ID' })
  @ApiResultResponse()
  @Delete('/:id')
  @Permission('system:user:delete')
  async deleteUser(@Param('id') id: number) {
    await this.userService.deleteUser(id);
  }

  /**
   * 重置密码
   * @param {ResetPasswordDto} resetPasswordDto
   */
  @ApiOperation({ summary: '重置密码' })
  @ApiResultResponse()
  @Put('reset-password')
  @Permission('system:user:resetPassword')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.userService.resetPassword(resetPasswordDto);
  }
}
