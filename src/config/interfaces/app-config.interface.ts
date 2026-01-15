import { RedisConfig } from './redis-config.interface';

export interface AppConfig {
    port: number;
    nodeEnv: string;
    redis: RedisConfig;
}

