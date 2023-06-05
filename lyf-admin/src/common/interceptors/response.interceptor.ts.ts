import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KEEP_KEY } from '../constants/decorator.constant';
import { ResponseResultDto } from 'src/common/dtos/result-response.dto';

// 响应格式统一
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // getHandler 值将覆盖 getClass上面的值
        const keep = this.reflector.getAllAndOverride<boolean>(KEEP_KEY, [
          context.getHandler(),
          context.getClass()
        ]);
        if (keep) return data;

        if (data instanceof ResponseResultDto) return data;

        const response = context.switchToHttp().getResponse();
        response.header('Content-Type', 'application/json; charset=utf-8');
        return ResponseResultDto.success(data);
      })
    );
  }
}
