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
  UseGuards,
  UsePipes
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  PageQueryDto,
  ChangeStatusDto,
  ResetPasswordDto
} from './dto/request.dto';
import { AuthGuard } from '@nestjs/passport';
import { PaginationPipe } from 'src/common/pipes/pagination.pipe';
import { Permission } from 'src/common/decorators/permission.decorator';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
    this.initAdminUser();
  }
  /**
   * 初始化管理员用户
   */
  async initAdminUser() {
    this.userService.initAdminUser();
  }

  /**
   * 获取当前系统用户信息
   */
  @Get('/info')
  async getCurrentUserInfo(@Req() req) {
    return await this.userService.getCurrentUserInfo(req.user.userId);
  }

  /**
   * 分页获取用户列表
   */
  @Get('/list')
  @Permission('system:user:query')
  @UsePipes(PaginationPipe)
  async getUserListByPage(@Query() query: PageQueryDto) {
    return await this.userService.getUserListByPage(query);
  }

  /**
   * 通过ID获取用户信息
   */
  @Get(':id')
  @Permission('system:user:query')
  async getUserDetailById(@Param('id') id: number) {
    return await this.userService.getUserDetailById(id);
  }

  /**
   * 创建用户
   * @param {CreateUserDto} createUserDto
   */
  @Post()
  @Permission('system:user:add')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return user;
  }

  /**
   * 编辑用户
   * @param {UpdateUserDto} updateUserDto
   */
  @Put()
  @Permission('system:user:edit')
  async updateUser(@Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.updateUser(updateUserDto);
    return user;
  }

  /**
   * 修改用户状态
   * @param {ChangeStatusDto} changeStatusDto
   */
  @Put('change-status')
  @Permission('system:user:edit')
  async changeStatus(@Body() changeStatusDto: ChangeStatusDto) {
    return await this.userService.changeStatus(changeStatusDto);
  }

  /**
   * 删除用户
   * @param {number} id
   */
  @Delete('/:id')
  @Permission('system:user:delete')
  async deleteUser(@Param('id') id: number) {
    return await this.userService.deleteUser(id);
  }

  /**
   * 重置密码
   * @param {ResetPasswordDto} resetPasswordDto
   */
  @Put('reset-password')
  @Permission('system:user:resetPassword')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.userService.resetPassword(resetPasswordDto);
  }
}
