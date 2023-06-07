import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  PermissionData,
  PermissionStrategyEnum
} from '../decorators/permission.decorator';
import { PERMISSION_KEY } from '../constants/decorator.constant';
import { UserService } from 'src/modules/user/user.service';
import { ApiException } from '../exceptions/api-exception';
import { ADMIN_USER_ID } from 'src/common/constants/admin.constant';
import { RedisService } from 'src/modules/redis/redis.service';
import { USER_PERMISSION_KEY } from '../constants/redis.contant';

@Injectable()
export class PermissionAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(RedisService)
    private readonly redis: RedisService
  ) {}
  async canActivate(context: ExecutionContext) {
    const permissionData = this.reflector.getAllAndOverride<PermissionData>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()]
    );
    let result = false;

    if (!permissionData || permissionData.permissions.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;

    // admin跳过权限验证
    if (userId === ADMIN_USER_ID) return true;

    // 用户权限code集合
    let userPermissionCodes = [];
    const cachePermissionsStr = await this.redis.get(
      `${USER_PERMISSION_KEY}:${userId}`
    );
    if (!cachePermissionsStr) {
      const userInfo = await this.userService.getCurrentUserInfo(userId);
      userPermissionCodes = userInfo.permissions || [];
    } else {
      userPermissionCodes = JSON.parse(cachePermissionsStr);
    }

    if (permissionData.strategy === PermissionStrategyEnum.OR) {
      result = permissionData.permissions.some((item) =>
        userPermissionCodes.includes(item)
      );
    } else {
      result = permissionData.permissions.every((item) =>
        userPermissionCodes.includes(item)
      );
    }
    if (!result) throw new ApiException('暂无权限访问，请联系管理员');
    return result;
  }
}
