import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { BaseService } from './base.service';
import { LocalAuthGuard } from 'src/common/guards/local.auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResultResponse } from 'src/common/decorators/api-result-response.decorator';
import { LoginResDto } from './dto/response.dto';
import { LoginDto } from './dto/request.dto';
@ApiTags('登录登出')
@Controller('')
export class BaseController {
  constructor(private readonly baseService: BaseService) {}

  @ApiOperation({ summary: '登录' })
  @ApiBody({ type: LoginDto })
  @ApiResultResponse(LoginResDto)
  @Post('/login')
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(@Req() req) {
    return this.baseService.login(req.user);
  }

  @ApiOperation({ summary: '登出' })
  @ApiResultResponse()
  @Post('/logout')
  async logout(@Req() req) {
    const token = req.headers?.authorization?.slice(7);
    return this.baseService.logout(token);
  }
}
