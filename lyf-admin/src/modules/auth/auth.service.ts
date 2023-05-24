import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ApiException } from 'src/common/exceptions/api-exception';
import { BcryptService } from '../shared/bcrypt.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  // 存储登录用户token的白名单，如果用户退出登录，则将token从白名单中删除。在校验token有效性前，先校验是否在白名单中。
  static whiteLists = new Set();
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly bctyptService: BcryptService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * 校验token
   * @param {string} token
   * @return {boolean}
   */
  validateToken(token: string) {
    if (!AuthService.whiteLists.has(token)) {
      throw new ApiException('登录状态已过期', 401);
    }
    return true;
  }
  /**
   * 移除token
   * @param {string} token
   */
  removeToken(token: string) {
    AuthService.whiteLists.delete(token);
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

    AuthService.whiteLists.add(token);

    return {
      token
    };
  }
}
