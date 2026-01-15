# NestJS Redis Project

Проект на NestJS с интеграцией Redis для работы с NoSQL данными.

## Структура проекта

```
src/
├── config/              # Конфигурация приложения
│   ├── config.module.ts
│   └── configuration.ts
├── common/              # Общие утилиты и интерфейсы
│   ├── interfaces/
│   └── utils/
├── redis/               # Redis модуль
│   ├── interfaces/
│   ├── redis.module.ts
│   ├── redis.service.ts
│   ├── redis.providers.ts
│   └── redis.constants.ts
├── modules/             # Бизнес-модули приложения
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts
```

## Установка и запуск

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка переменных окружения

Создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

Отредактируйте `.env` файл при необходимости:

```env
PORT=3000
NODE_ENV=development

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_KEY_PREFIX=app:
```

### 3. Запуск Redis через Docker Compose

```bash
docker-compose up -d
```

Это создаст Redis контейнер с именем `redis-server` на порту 6379.

### 4. Запуск приложения

```bash
# Режим разработки
npm run start:dev

# Продакшн режим
npm run start:prod
```

Приложение будет доступно по адресу: `http://localhost:3000`

**Swagger документация**: `http://localhost:3000/api/docs`

## Использование Redis

### В сервисах

```typescript
import { Injectable } from '@nestjs/common';
import { RedisService } from './redis/redis.service';

@Injectable()
export class MyService {
  constructor(private readonly redisService: RedisService) {}

  async example() {
    // String операции
    await this.redisService.set('key', 'value', 3600); // с TTL
    const value = await this.redisService.get('key');
    
    // Hash операции
    await this.redisService.hset('user:1', 'name', 'John');
    const user = await this.redisService.hgetall('user:1');
    
    // List операции
    await this.redisService.lpush('queue', 'item1', 'item2');
    const items = await this.redisService.lrange('queue', 0, -1);
    
    // Set операции
    await this.redisService.sadd('tags', 'tag1', 'tag2');
    const tags = await this.redisService.smembers('tags');
    
    // Sorted Set операции
    await this.redisService.zadd('leaderboard', 100, 'user1');
    const topUsers = await this.redisService.zrange('leaderboard', 0, 9);
  }
}
```

### Доступные методы RedisService

#### String операции
- `set(key, value, ttl?)` - установить значение
- `get(key)` - получить значение
- `del(key)` - удалить ключ
- `exists(key)` - проверить существование
- `expire(key, seconds)` - установить TTL
- `ttl(key)` - получить оставшееся время

#### Hash операции
- `hset(key, field, value)` - установить поле
- `hget(key, field)` - получить поле
- `hgetall(key)` - получить все поля
- `hdel(key, ...fields)` - удалить поля

#### List операции
- `lpush(key, ...values)` - добавить слева
- `rpush(key, ...values)` - добавить справа
- `lpop(key)` - получить и удалить слева
- `rpop(key)` - получить и удалить справа
- `lrange(key, start, stop)` - получить диапазон
- `llen(key)` - получить длину

#### Set операции
- `sadd(key, ...members)` - добавить элементы
- `smembers(key)` - получить все элементы
- `srem(key, ...members)` - удалить элементы
- `sismember(key, member)` - проверить наличие

#### Sorted Set операции
- `zadd(key, score, member)` - добавить с оценкой
- `zrange(key, start, stop)` - получить диапазон
- `zrangeWithScores(key, start, stop)` - получить с оценками
- `zrem(key, ...members)` - удалить элементы

#### Утилиты
- `keys(pattern)` - найти ключи по паттерну
- `flushdb()` - очистить базу данных
- `ping()` - проверить соединение

## API Endpoints

- `GET /api` - Hello World
- `GET /api/health` - Проверка статуса Redis

## Swagger Documentation

В проекте настроен Swagger для интерактивного тестирования API.

После запуска приложения документация доступна по адресу:
- **Swagger UI**: http://localhost:3000/api/docs

### Использование Swagger

1. Запустите приложение: `npm run start:dev`
2. Откройте браузер и перейдите на http://localhost:3000/api/docs
3. В интерфейсе Swagger вы можете:
   - Просматривать все доступные endpoints
   - Видеть описание каждого endpoint
   - Тестировать API прямо в браузере
   - Просматривать схемы запросов и ответов

Swagger автоматически обновляется при изменении кода в режиме разработки.

## Docker Compose

Redis запускается в отдельном контейнере с:
- Персистентностью данных (volume `redis-data`)
- Healthcheck для мониторинга
- Настраиваемым паролем через переменную окружения `REDIS_PASSWORD`

### Управление контейнером

```bash
# Запуск
docker-compose up -d

# Остановка
docker-compose down

# Просмотр логов
docker-compose logs -f redis

# Остановка с удалением данных
docker-compose down -v
```

## Разработка

### Тестирование

```bash
# Unit тесты
npm run test

# E2E тесты
npm run test:e2e

# Покрытие кода
npm run test:cov
```

### Линтинг

```bash
npm run lint
```

## Лицензия

MIT
