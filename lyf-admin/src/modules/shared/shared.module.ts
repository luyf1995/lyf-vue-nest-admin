import { Global, Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { BcryptService } from './bcrypt.service';

@Global()
@Module({
  providers: [UtilsService, BcryptService],
  exports: [UtilsService, BcryptService]
})
export class SharedModule {}
