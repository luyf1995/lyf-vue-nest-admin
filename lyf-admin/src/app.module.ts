import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import Configuration from './config/configuration';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RedisModule } from './modules/redis/redis.module';
import { SharedModule } from './modules/shared/shared.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PermissionModule } from './modules/permission/permisson.module';
import { RoleModule } from './modules/role/role.module';
import { DepartmentModule } from './modules/department/department.module';

import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { PermissionAuthGuard } from 'src/common/guards/permissions.auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      load: [Configuration]
    }),
    PrismaModule,
    RedisModule,
    SharedModule,
    UserModule,
    AuthModule,
    PermissionModule,
    RoleModule,
    DepartmentModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // JWT身份验证
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      // 权限验证
      provide: APP_GUARD,
      useClass: PermissionAuthGuard
    }
  ]
})
export class AppModule {}
