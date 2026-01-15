import { Injectable, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) { }

  async onModuleInit() {
    try {
      await this.redisClient.connect();
      console.log('Redis service initialized');
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }

  get client(): Redis {
    return this.redisClient;
  }

  // String operations
  async set(key: string, value: string, ttl?: number): Promise<'OK' | null> {
    if (ttl) {
      return this.redisClient.setex(key, ttl, value);
    }
    return this.redisClient.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async del(key: string): Promise<number> {
    return this.redisClient.del(key);
  }

  async exists(key: string): Promise<number> {
    return this.redisClient.exists(key);
  }

  async expire(key: string, seconds: number): Promise<number> {
    return this.redisClient.expire(key, seconds);
  }

  async ttl(key: string): Promise<number> {
    return this.redisClient.ttl(key);
  }

  // Hash operations
  async hset(key: string, field: string, value: string): Promise<number> {
    return this.redisClient.hset(key, field, value);
  }

  async hget(key: string, field: string): Promise<string | null> {
    return this.redisClient.hget(key, field);
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    return this.redisClient.hgetall(key);
  }

  async hdel(key: string, ...fields: string[]): Promise<number> {
    return this.redisClient.hdel(key, ...fields);
  }

  // List operations
  async lpush(key: string, ...values: string[]): Promise<number> {
    return this.redisClient.lpush(key, ...values);
  }

  async rpush(key: string, ...values: string[]): Promise<number> {
    return this.redisClient.rpush(key, ...values);
  }

  async lpop(key: string): Promise<string | null> {
    return this.redisClient.lpop(key);
  }

  async rpop(key: string): Promise<string | null> {
    return this.redisClient.rpop(key);
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.redisClient.lrange(key, start, stop);
  }

  async llen(key: string): Promise<number> {
    return this.redisClient.llen(key);
  }

  // Set operations
  async sadd(key: string, ...members: string[]): Promise<number> {
    return this.redisClient.sadd(key, ...members);
  }

  async smembers(key: string): Promise<string[]> {
    return this.redisClient.smembers(key);
  }

  async srem(key: string, ...members: string[]): Promise<number> {
    return this.redisClient.srem(key, ...members);
  }

  async sismember(key: string, member: string): Promise<number> {
    return this.redisClient.sismember(key, member);
  }

  // Sorted Set operations
  async zadd(key: string, score: number, member: string): Promise<number> {
    return this.redisClient.zadd(key, score, member);
  }

  async zrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.redisClient.zrange(key, start, stop);
  }

  async zrangeWithScores(key: string, start: number, stop: number): Promise<Array<{ score: number; member: string }>> {
    return this.redisClient.zrange(key, start, stop, 'WITHSCORES').then((result) => {
      const pairs: Array<{ score: number; member: string }> = [];
      for (let i = 0; i < result.length; i += 2) {
        pairs.push({
          member: result[i],
          score: parseFloat(result[i + 1]),
        });
      }
      return pairs;
    });
  }

  async zrem(key: string, ...members: string[]): Promise<number> {
    return this.redisClient.zrem(key, ...members);
  }

  // Utility operations
  async keys(pattern: string): Promise<string[]> {
    return this.redisClient.keys(pattern);
  }

  async flushdb(): Promise<'OK'> {
    return this.redisClient.flushdb();
  }

  async ping(): Promise<'PONG'> {
    return this.redisClient.ping();
  }

  // JSON operations (if redis-json is available)
  async setJson(key: string, path: string, value: any): Promise<any> {
    return this.redisClient.call('JSON.SET', key, path, JSON.stringify(value));
  }

  async getJson(key: string, path?: string): Promise<any> {
    const result = await this.redisClient.call('JSON.GET', key, path || '.');
    return result ? JSON.parse(result as string) : null;
  }
}

