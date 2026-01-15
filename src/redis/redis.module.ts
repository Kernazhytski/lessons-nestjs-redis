import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { redisProviders } from './redis.providers';

@Global()
@Module({
  providers: [...redisProviders, RedisService],
  exports: [RedisService],
})
export class RedisModule {}

