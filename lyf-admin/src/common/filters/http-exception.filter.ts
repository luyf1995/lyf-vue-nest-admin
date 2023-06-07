import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { ApiException } from '../exceptions/api-exception';
import { ResponseResultDto } from 'src/common/dtos/result-response.dto';
import { LoggerService } from 'src/modules/shared/logger.service';

// 自定义错误拦截
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const { status, result } = this.errorResult(exception);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.status(status).json(result);

    this.logger.error(
      `${request.method} ${request.url} params:${JSON.stringify({
        params: request.params,
        query: request.query,
        body: request.body
      })}`,
      result.message
    );
  }
  /* 解析错误类型，获取状态码和返回值 */
  errorResult(exception: HttpException) {
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const code =
      exception instanceof ApiException
        ? (exception as ApiException).getErrCode()
        : status;

    let message: string;
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      message = (response as any).message ?? response;
    } else {
      message = `${exception}`;
    }
    return {
      status,
      result: ResponseResultDto.error(message, code)
    };
  }
}
