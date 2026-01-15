export interface RedisConfig {
    host: string;
    port: number;
    password?: string;
    db: number;
    keyPrefix: string;
    retryStrategy: (times: number) => number;
    maxRetriesPerRequest: number;
    enableReadyCheck: boolean;
    enableOfflineQueue: boolean;
}

