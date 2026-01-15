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

  /**
   * Получить прямой доступ к Redis клиенту
   * @returns Экземпляр Redis клиента для прямого использования
   */
  get client(): Redis {
    return this.redisClient;
  }

  // String operations

  /**
   * Установить строковое значение для ключа
   * @param key - Имя ключа
   * @param value - Строковое значение для сохранения
   * @param ttl - Опционально: время жизни ключа в секундах (TTL - Time To Live)
   * @returns 'OK' при успехе, null при ошибке
   */
  async set(key: string, value: string, ttl?: number): Promise<'OK' | null> {
    if (ttl) {
      return this.redisClient.setex(key, ttl, value);
    }
    return this.redisClient.set(key, value);
  }

  /**
   * Получить строковое значение по ключу
   * @param key - Имя ключа
   * @returns Значение ключа или null, если ключ не существует
   */
  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  /**
   * Удалить один или несколько ключей
   * @param key - Имя ключа для удаления
   * @returns Количество удаленных ключей (0, если ключ не существовал)
   */
  async del(key: string): Promise<number> {
    return this.redisClient.del(key);
  }

  /**
   * Проверить существование ключа
   * @param key - Имя ключа для проверки
   * @returns 1, если ключ существует, 0 - если не существует
   */
  async exists(key: string): Promise<number> {
    return this.redisClient.exists(key);
  }

  /**
   * Установить время жизни ключа (TTL)
   * @param key - Имя ключа
   * @param seconds - Время жизни в секундах
   * @returns 1, если TTL установлен, 0 - если ключ не существует
   */
  async expire(key: string, seconds: number): Promise<number> {
    return this.redisClient.expire(key, seconds);
  }

  /**
   * Получить оставшееся время жизни ключа (TTL)
   * @param key - Имя ключа
   * @returns Оставшееся время в секундах, -1 - если TTL не установлен, -2 - если ключ не существует
   */
  async ttl(key: string): Promise<number> {
    return this.redisClient.ttl(key);
  }

  /**
   * Увеличить числовое значение ключа на 1 (атомарная операция)
   * Если ключ не существует, создается со значением 0, затем увеличивается до 1
   * Используется для счетчиков, ID генераторов и т.д.
   * @param key - Имя ключа
   * @returns Новое значение после увеличения
   */
  async incr(key: string): Promise<number> {
    return this.redisClient.incr(key);
  }

  /**
   * Увеличить числовое значение ключа на указанное число (атомарная операция)
   * Если ключ не существует, создается со значением 0, затем увеличивается на указанное число
   * @param key - Имя ключа
   * @param increment - Число, на которое нужно увеличить значение (может быть отрицательным)
   * @returns Новое значение после увеличения
   */
  async incrby(key: string, increment: number): Promise<number> {
    return this.redisClient.incrby(key, increment);
  }

  /**
   * Уменьшить числовое значение ключа на 1 (атомарная операция)
   * Если ключ не существует, создается со значением 0, затем уменьшается до -1
   * @param key - Имя ключа
   * @returns Новое значение после уменьшения
   */
  async decr(key: string): Promise<number> {
    return this.redisClient.decr(key);
  }

  /**
   * Уменьшить числовое значение ключа на указанное число (атомарная операция)
   * Если ключ не существует, создается со значением 0, затем уменьшается на указанное число
   * @param key - Имя ключа
   * @param decrement - Число, на которое нужно уменьшить значение (может быть отрицательным)
   * @returns Новое значение после уменьшения
   */
  async decrby(key: string, decrement: number): Promise<number> {
    return this.redisClient.decrby(key, decrement);
  }

  // Hash operations

  /**
   * Установить значение поля в хеше (Hash)
   * Хеш - это структура данных типа ключ-значение, где ключ содержит поля
   * @param key - Имя ключа хеша
   * @param field - Имя поля в хеше
   * @param value - Значение для поля
   * @returns 1, если поле создано, 0 - если поле обновлено
   */
  async hset(key: string, field: string, value: string): Promise<number> {
    return this.redisClient.hset(key, field, value);
  }

  /**
   * Получить значение поля из хеша
   * @param key - Имя ключа хеша
   * @param field - Имя поля в хеше
   * @returns Значение поля или null, если поле не существует
   */
  async hget(key: string, field: string): Promise<string | null> {
    return this.redisClient.hget(key, field);
  }

  /**
   * Получить все поля и значения из хеша
   * @param key - Имя ключа хеша
   * @returns Объект со всеми полями и значениями хеша
   */
  async hgetall(key: string): Promise<Record<string, string>> {
    return this.redisClient.hgetall(key);
  }

  /**
   * Удалить одно или несколько полей из хеша
   * @param key - Имя ключа хеша
   * @param fields - Имена полей для удаления (можно передать несколько)
   * @returns Количество удаленных полей
   */
  async hdel(key: string, ...fields: string[]): Promise<number> {
    return this.redisClient.hdel(key, ...fields);
  }

  // List operations

  /**
   * Добавить элементы в начало списка (слева)
   * Список - это упорядоченная коллекция строк
   * @param key - Имя ключа списка
   * @param values - Элементы для добавления (можно передать несколько)
   * @returns Длина списка после добавления элементов
   */
  async lpush(key: string, ...values: string[]): Promise<number> {
    return this.redisClient.lpush(key, ...values);
  }

  /**
   * Добавить элементы в конец списка (справа)
   * @param key - Имя ключа списка
   * @param values - Элементы для добавления (можно передать несколько)
   * @returns Длина списка после добавления элементов
   */
  async rpush(key: string, ...values: string[]): Promise<number> {
    return this.redisClient.rpush(key, ...values);
  }

  /**
   * Получить и удалить первый элемент списка (слева)
   * @param key - Имя ключа списка
   * @returns Значение элемента или null, если список пуст
   */
  async lpop(key: string): Promise<string | null> {
    return this.redisClient.lpop(key);
  }

  /**
   * Получить и удалить последний элемент списка (справа)
   * @param key - Имя ключа списка
   * @returns Значение элемента или null, если список пуст
   */
  async rpop(key: string): Promise<string | null> {
    return this.redisClient.rpop(key);
  }

  /**
   * Получить диапазон элементов из списка
   * @param key - Имя ключа списка
   * @param start - Начальный индекс (0 - первый элемент, -1 - последний)
   * @param stop - Конечный индекс (включительно, -1 - до конца списка)
   * @returns Массив элементов в указанном диапазоне
   */
  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.redisClient.lrange(key, start, stop);
  }

  /**
   * Получить длину списка (количество элементов)
   * @param key - Имя ключа списка
   * @returns Количество элементов в списке, 0 - если список не существует или пуст
   */
  async llen(key: string): Promise<number> {
    return this.redisClient.llen(key);
  }

  // Set operations

  /**
   * Добавить элементы в множество (Set)
   * Множество - это неупорядоченная коллекция уникальных строк
   * @param key - Имя ключа множества
   * @param members - Элементы для добавления (можно передать несколько, дубликаты игнорируются)
   * @returns Количество новых элементов, добавленных в множество
   */
  async sadd(key: string, ...members: string[]): Promise<number> {
    return this.redisClient.sadd(key, ...members);
  }

  /**
   * Получить все элементы множества
   * @param key - Имя ключа множества
   * @returns Массив всех элементов множества (порядок не гарантирован)
   */
  async smembers(key: string): Promise<string[]> {
    return this.redisClient.smembers(key);
  }

  /**
   * Удалить элементы из множества
   * @param key - Имя ключа множества
   * @param members - Элементы для удаления (можно передать несколько)
   * @returns Количество удаленных элементов
   */
  async srem(key: string, ...members: string[]): Promise<number> {
    return this.redisClient.srem(key, ...members);
  }

  /**
   * Проверить, является ли элемент членом множества
   * @param key - Имя ключа множества
   * @param member - Элемент для проверки
   * @returns 1, если элемент является членом множества, 0 - если нет
   */
  async sismember(key: string, member: string): Promise<number> {
    return this.redisClient.sismember(key, member);
  }

  /**
   * Получить количество элементов в множестве
   * @param key - Имя ключа множества
   * @returns Количество элементов в множестве, 0 - если множество не существует или пусто
   */
  async scard(key: string): Promise<number> {
    return this.redisClient.scard(key);
  }

  /**
   * Получить и удалить случайный элемент из множества
   * @param key - Имя ключа множества
   * @returns Случайный элемент или null, если множество пусто
   */
  async spop(key: string): Promise<string | null> {
    return this.redisClient.spop(key);
  }

  /**
   * Получить один или несколько случайных элементов из множества (без удаления)
   * @param key - Имя ключа множества
   * @param count - Опционально: количество элементов для получения (по умолчанию 1)
   * @returns Случайный элемент (строка) или массив элементов, или null если множество пусто
   */
  async srandmember(key: string, count?: number): Promise<string | string[] | null> {
    if (count !== undefined) {
      return this.redisClient.srandmember(key, count);
    }
    return this.redisClient.srandmember(key);
  }

  /**
   * Переместить элемент из одного множества в другое (атомарная операция)
   * @param source - Имя исходного множества
   * @param destination - Имя целевого множества
   * @param member - Элемент для перемещения
   * @returns 1, если элемент перемещен, 0 - если элемент не существует в исходном множестве
   */
  async smove(source: string, destination: string, member: string): Promise<number> {
    return this.redisClient.smove(source, destination, member);
  }

  /**
   * Объединить несколько множеств и вернуть результат
   * @param keys - Имена множеств для объединения (можно передать несколько)
   * @returns Массив всех уникальных элементов из всех множеств
   */
  async sunion(...keys: string[]): Promise<string[]> {
    return this.redisClient.sunion(...keys);
  }

  /**
   * Найти пересечение нескольких множеств (общие элементы)
   * @param keys - Имена множеств для пересечения (можно передать несколько)
   * @returns Массив элементов, которые присутствуют во всех множествах
   */
  async sinter(...keys: string[]): Promise<string[]> {
    return this.redisClient.sinter(...keys);
  }

  /**
   * Найти разность множеств (элементы из первого множества, которых нет в остальных)
   * @param keys - Имена множеств (первое - источник, остальные - для вычитания)
   * @returns Массив элементов из первого множества, которых нет в остальных
   */
  async sdiff(...keys: string[]): Promise<string[]> {
    return this.redisClient.sdiff(...keys);
  }

  // Sorted Set operations

  /**
   * Добавить элемент в отсортированное множество (Sorted Set)
   * Отсортированное множество - это множество, где каждый элемент имеет числовую оценку (score)
   * Элементы автоматически сортируются по оценке
   * @param key - Имя ключа отсортированного множества
   * @param score - Числовая оценка элемента (используется для сортировки)
   * @param member - Элемент для добавления
   * @returns 1, если элемент добавлен, 0 - если элемент обновлен (с новой оценкой)
   */
  async zadd(key: string, score: number, member: string): Promise<number> {
    return this.redisClient.zadd(key, score, member);
  }

  /**
   * Получить диапазон элементов из отсортированного множества по индексу
   * Элементы возвращаются в порядке возрастания оценок
   * @param key - Имя ключа отсортированного множества
   * @param start - Начальный индекс (0 - первый элемент, -1 - последний)
   * @param stop - Конечный индекс (включительно, -1 - до конца)
   * @returns Массив элементов в указанном диапазоне (без оценок)
   */
  async zrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.redisClient.zrange(key, start, stop);
  }

  /**
   * Получить диапазон элементов из отсортированного множества с их оценками
   * @param key - Имя ключа отсортированного множества
   * @param start - Начальный индекс (0 - первый элемент, -1 - последний)
   * @param stop - Конечный индекс (включительно, -1 - до конца)
   * @returns Массив объектов с полями member (элемент) и score (оценка)
   */
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

  /**
   * Удалить элементы из отсортированного множества
   * @param key - Имя ключа отсортированного множества
   * @param members - Элементы для удаления (можно передать несколько)
   * @returns Количество удаленных элементов
   */
  async zrem(key: string, ...members: string[]): Promise<number> {
    return this.redisClient.zrem(key, ...members);
  }

  // Utility operations

  /**
   * Найти все ключи, соответствующие паттерну
   * ВНИМАНИЕ: Эта операция может быть медленной на больших базах данных
   * @param pattern - Паттерн для поиска (например, 'user:*' найдет все ключи, начинающиеся с 'user:')
   *                  Используйте '*' для всех ключей, '?' для одного символа
   * @returns Массив ключей, соответствующих паттерну
   */
  async keys(pattern: string): Promise<string[]> {
    return this.redisClient.keys(pattern);
  }

  /**
   * Очистить текущую базу данных (удалить все ключи)
   * ВНИМАНИЕ: Эта операция необратима и удалит все данные!
   * @returns 'OK' при успешном выполнении
   */
  async flushdb(): Promise<'OK'> {
    return this.redisClient.flushdb();
  }

  /**
   * Проверить соединение с Redis сервером
   * Используется для проверки доступности Redis
   * @returns 'PONG' при успешном соединении
   */
  async ping(): Promise<'PONG'> {
    return this.redisClient.ping();
  }

  // JSON operations (if redis-json is available)

  /**
   * Установить JSON значение в Redis (требует модуль RedisJSON)
   * RedisJSON - это модуль Redis, который добавляет поддержку JSON данных
   * @param key - Имя ключа
   * @param path - Путь в JSON структуре (например, '.user.name' или '$' для корня)
   * @param value - JavaScript объект, который будет преобразован в JSON
   * @returns Результат операции (обычно 'OK')
   */
  async setJson(key: string, path: string, value: any): Promise<any> {
    return this.redisClient.call('JSON.SET', key, path, JSON.stringify(value));
  }

  /**
   * Получить JSON значение из Redis (требует модуль RedisJSON)
   * @param key - Имя ключа
   * @param path - Опционально: путь в JSON структуре (по умолчанию '.' - корень)
   * @returns Распарсенный JavaScript объект или null, если ключ не существует
   */
  async getJson(key: string, path?: string): Promise<any> {
    const result = await this.redisClient.call('JSON.GET', key, path || '.');
    return result ? JSON.parse(result as string) : null;
  }
}

