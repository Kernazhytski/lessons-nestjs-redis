import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';
import { RedisConfig } from '../config/interfaces/redis-config.interface';

export const redisProviders: Provider[] = [
  {
    provide: REDIS_CLIENT,
    useFactory: (configService: ConfigService): Redis => {
      const redisConfig = configService.get<RedisConfig>('redis');

      if (!redisConfig) {
        throw new Error('Redis configuration is not defined');
      }

      const client = new Redis({
        host: redisConfig.host,
        port: redisConfig.port,
        password: redisConfig.password,
        db: redisConfig.db,
        keyPrefix: redisConfig.keyPrefix,
        retryStrategy: redisConfig.retryStrategy,
        maxRetriesPerRequest: redisConfig.maxRetriesPerRequest,
        enableReadyCheck: redisConfig.enableReadyCheck,
        enableOfflineQueue: redisConfig.enableOfflineQueue,
        lazyConnect: true,
      });

      client.on('connect', () => {
        console.log('Redis: Connected');
      });

      client.on('ready', () => {
        console.log('Redis: Ready');
      });

      client.on('error', (error) => {
        console.error('Redis: Error', error);
      });

      client.on('close', () => {
        console.log('Redis: Connection closed');
      });

      client.on('reconnecting', () => {
        console.log('Redis: Reconnecting...');
      });

      return client;
    },
    inject: [ConfigService],
  },
];

