import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor.ts';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // api前缀
  app.setGlobalPrefix('api');

  // 全局注册，统一响应格式
  app.useGlobalInterceptors(new ResponseInterceptor(new Reflector()));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 原始类型的转换，如string转化为number
      whitelist: true // 不会接受dto定义以外的属性
      // forbidNonWhitelisted: true, // 如果传入dto定义意外的属性，服务端则会报400错
    })
  );

  // execption，报错过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 跨域
  app.enableCors();

  await app.listen(8888);
}
bootstrap();
