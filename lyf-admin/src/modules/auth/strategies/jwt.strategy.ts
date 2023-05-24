import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { jwtConstants } from '../auth.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true //设置回调的第一个参数是  request
    });
  }
  /**
   * JWT验证
   * @param {Request} request
   * @param {*} payload
   */
  async validate(request: Request, payload: { userId: number }) {
    const token = (request.headers as any).authorization.slice(7);

    await this.authService.validateToken(token);

    return payload;
  }
}
