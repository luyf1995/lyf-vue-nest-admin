import { SetMetadata } from '@nestjs/common';
import { PUBLIC_KEY } from '../constants/decorator.constant';

// 设置不进行 jwt 校验
export const Public = () => SetMetadata(PUBLIC_KEY, true);
