import { SetMetadata } from '@nestjs/common';
import { KEEP_KEY } from '../contants/decorator.content';

/**
 * 不转化成JSON结构，保留原有返回
 */
export const Keep = () => SetMetadata(KEEP_KEY, true);
