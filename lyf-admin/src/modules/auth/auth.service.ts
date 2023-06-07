import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ApiException } from 'src/common/exceptions/api-exception';
import { BcryptService } from '../shared/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';
import { USER_TOKEN_KEY } from 'src/common/constants/redis.contant';
@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly bctyptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly redisSerivce: RedisService
  ) {}

  /**
   * 校验token
   * @param {number} userId 用户id
   * @param {string} token
   * @return {boolean}
   */
  async validateToken(userId: number, token) {
    const user = this.userService.getUserById(userId);
    if (!user) {
      throw new ApiException('用户认证失败！', 401);
    }

    const cacheToken = await this.redisSerivce.get(
      `${USER_TOKEN_KEY}:${userId}`
    );

    if (!cacheToken || token !== cacheToken) {
      throw new ApiException('登录状态已过期！', 401);
    }
    return true;
  }
  /**
   * 移除token
   * @param {number} userId
   */
  removeToken(userId: number) {
    this.redisSerivce.del(`${USER_TOKEN_KEY}:${userId}`);
  }

  /**
   * 校验用户信息
   * @param {string} username
   * @param {string} password
   * @return {*}
   */
  async validateUser(username: string, password: string) {
    const user = await this.userService.getUserByUsername(username);
    if (!user) throw new ApiException('用户不存在！');

    if (!(await this.bctyptService.compare(password, user.password)))
      throw new ApiException('密码错误!');

    return user;
  }

  /**
   * 生成token
   * @param {Object} payload
   */
  generateToken(payload: { userId: number }) {
    const token = this.jwtService.sign(payload);

    // !! cache-manager-redis-store@3.0.1版本redisStore的set方法第三个参数是Object类型，而cacheManager@5.2.5的set方法第三个参数ttl是number类型
    this.redisSerivce.set(`${USER_TOKEN_KEY}:${payload.userId}`, token, {
      ttl: 60 * 60 * 24 * 1000 // 有效期设置为24小时
    });

    return {
      token
    };
  }
}
