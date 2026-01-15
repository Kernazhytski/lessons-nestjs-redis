import { Injectable } from '@nestjs/common';
import { RedisService } from './redis/redis.service';

@Injectable()
export class AppService {
  constructor(private readonly redisService: RedisService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getRedisStatus(): Promise<{ status: string; ping: string }> {
    const ping = await this.redisService.ping();
    return {
      status: 'connected',
      ping,
    };
  }
}
