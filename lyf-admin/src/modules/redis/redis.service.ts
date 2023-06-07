import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache
  ) {}
  async get(key: string): Promise<string> {
    return await this.cacheManager.get(key);
  }
  async set(key: string, value: string, ttl?: any) {
    await this.cacheManager.set(key, value, ttl);
  }
  async del(key: string) {
    await this.cacheManager.del(key);
  }
}
