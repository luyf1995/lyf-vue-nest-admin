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

@Injectable()
export class PermissionAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(UserService)
    private readonly userService: UserService
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

    // 获取用户权限，后续可以加入到缓存中，而不用每次都从数据库获取
    const userInfo = await this.userService.getCurrentUserInfo(userId);

    const userPermissions = userInfo.permissions || [];

    if (permissionData.strategy === PermissionStrategyEnum.OR) {
      result = permissionData.permissions.some((item) =>
        userPermissions.includes(item)
      );
    } else {
      result = permissionData.permissions.every((item) =>
        userPermissions.includes(item)
      );
    }
    if (!result) throw new ApiException('暂无权限访问，请联系管理员');
    return result;
  }
}
