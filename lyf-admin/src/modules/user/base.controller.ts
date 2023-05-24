import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { BaseService } from './base.service';
import { LocalAuthGuard } from 'src/common/guards/local.auth.guard';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('')
export class BaseController {
  constructor(private readonly baseService: BaseService) {}
  @Post('/login')
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(@Req() req) {
    return this.baseService.login(req.user);
  }

  @Post('/logout')
  async logout(@Req() req) {
    const token = req.headers?.authorization?.slice(7);
    return this.baseService.logout(token);
  }
}
