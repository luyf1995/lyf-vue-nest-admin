import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { BcryptService } from './bcrypt.service';
import { LoggerService } from './logger.service';
import { LoggerMiddleware } from 'src/common/middlewares/logger.middleware';

@Global()
@Module({
  providers: [UtilsService, BcryptService, LoggerService],
  exports: [UtilsService, BcryptService, LoggerService]
})
export class SharedModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
