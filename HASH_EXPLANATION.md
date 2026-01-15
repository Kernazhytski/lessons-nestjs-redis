# Хеш (Hash) в Redis - Подробное объяснение

## Что такое хеш в Redis?

**Хеш (Hash)** - это структура данных в Redis, которая хранит набор полей (fields) и их значений внутри одного ключа.

Представьте хеш как объект JavaScript или словарь Python:
- Один ключ Redis содержит несколько пар "поле-значение"
- Каждое поле имеет свое значение
- Все поля хранятся под одним ключом

## Аналогия

### Обычный ключ-значение (String):
```
user:1 = "John Doe"  ← одно значение
```

### Хеш:
```
user:1 = {
  name: "John Doe",
  email: "john@example.com",
  age: "30",
  city: "Moscow"
}  ← несколько полей под одним ключом
```

## Зачем нужны хеши?

1. **Эффективность памяти** - хеш хранит данные компактнее, чем отдельные ключи
2. **Логическая группировка** - связанные данные хранятся вместе
3. **Частичное обновление** - можно обновить одно поле, не затрагивая другие
4. **Атомарные операции** - можно работать с отдельными полями атомарно

## Сравнение подходов

### ❌ Плохо: Много отдельных ключей
```typescript
await redis.set('user:1:name', 'John Doe');
await redis.set('user:1:email', 'john@example.com');
await redis.set('user:1:age', '30');
await redis.set('user:1:city', 'Moscow');
// 4 ключа, 4 операции
```

### ✅ Хорошо: Один хеш
```typescript
await redis.hset('user:1', 'name', 'John Doe');
await redis.hset('user:1', 'email', 'john@example.com');
await redis.hset('user:1', 'age', '30');
await redis.hset('user:1', 'city', 'Moscow');
// 1 ключ, все данные вместе
```

## Методы работы с хешами

### 1. HSET - Установить значение поля

```typescript
await redis.hset('user:1', 'name', 'John Doe');
```

**Что происходит:**
- Создается или обновляется ключ `user:1`
- В нем создается поле `name` со значением `John Doe`
- Если поле уже существует, значение обновляется

**Структура в Redis:**
```
user:1 → {
  name: "John Doe"
}
```

### 2. HGET - Получить значение поля

```typescript
const name = await redis.hget('user:1', 'name');
// Вернет: "John Doe"
```

**Что происходит:**
- Ищется ключ `user:1`
- Из него извлекается значение поля `name`
- Возвращается только это значение

### 3. HGETALL - Получить все поля и значения

```typescript
const user = await redis.hgetall('user:1');
// Вернет: { name: "John Doe", email: "john@example.com", age: "30" }
```

**Что происходит:**
- Ищется ключ `user:1`
- Возвращаются ВСЕ поля и их значения
- Результат - объект JavaScript

### 4. HDEL - Удалить поля

```typescript
await redis.hdel('user:1', 'age', 'city');
// Удалит поля 'age' и 'city' из хеша user:1
```

**Что происходит:**
- Из ключа `user:1` удаляются указанные поля
- Остальные поля остаются нетронутыми
- Если ключ становится пустым, он удаляется

## Полный пример использования

```typescript
// 1. Создаем профиль пользователя
await redis.hset('user:1', 'name', 'John Doe');
await redis.hset('user:1', 'email', 'john@example.com');
await redis.hset('user:1', 'age', '30');
await redis.hset('user:1', 'city', 'Moscow');

// 2. Получаем одно поле
const name = await redis.hget('user:1', 'name');
console.log(name); // "John Doe"

// 3. Получаем все данные пользователя
const user = await redis.hgetall('user:1');
console.log(user);
// {
//   name: "John Doe",
//   email: "john@example.com",
//   age: "30",
//   city: "Moscow"
// }

// 4. Обновляем одно поле
await redis.hset('user:1', 'age', '31');

// 5. Удаляем поле
await redis.hdel('user:1', 'city');

// 6. Проверяем результат
const updatedUser = await redis.hgetall('user:1');
console.log(updatedUser);
// {
//   name: "John Doe",
//   email: "john@example.com",
//   age: "31"
//   // city удален
// }
```

## Визуальное представление

```
┌─────────────────────────────────────┐
│  Ключ: user:1                      │
├─────────────────────────────────────┤
│  Поле: name    → Значение: "John"  │
│  Поле: email   → Значение: "..."   │
│  Поле: age     → Значение: "30"    │
│  Поле: city    → Значение: "Moscow"│
└─────────────────────────────────────┘
```

## Когда использовать хеши?

✅ **Используйте хеши, когда:**
- Нужно хранить объект с несколькими полями
- Данные логически связаны (профиль пользователя, настройки, конфигурация)
- Нужно обновлять отдельные поля независимо
- Важна эффективность памяти

❌ **Не используйте хеши, когда:**
- Нужно хранить одно простое значение (используйте String)
- Нужна сортировка (используйте Sorted Set)
- Нужна очередь (используйте List)

## Дополнительные операции (не реализованы в нашем сервисе, но доступны в Redis)

- `HMSET` - установить несколько полей за раз
- `HMGET` - получить несколько полей за раз
- `HKEYS` - получить только имена полей
- `HVALS` - получить только значения полей
- `HEXISTS` - проверить существование поля
- `HLEN` - получить количество полей в хеше
- `HINCRBY` - увеличить числовое значение поля

## Практический пример: Профиль пользователя

```typescript
class UserService {
  constructor(private redis: RedisService) {}

  async createUser(userId: string, userData: {
    name: string;
    email: string;
    age: number;
  }) {
    // Сохраняем все поля пользователя в одном хеше
    await this.redis.hset(`user:${userId}`, 'name', userData.name);
    await this.redis.hset(`user:${userId}`, 'email', userData.email);
    await this.redis.hset(`user:${userId}`, 'age', userData.age.toString());
  }

  async getUser(userId: string) {
    // Получаем все данные пользователя одной операцией
    return await this.redis.hgetall(`user:${userId}`);
  }

  async updateUserEmail(userId: string, newEmail: string) {
    // Обновляем только email, остальные поля не трогаем
    await this.redis.hset(`user:${userId}`, 'email', newEmail);
  }

  async deleteUser(userId: string) {
    // Удаляем весь хеш (все поля сразу)
    await this.redis.del(`user:${userId}`);
  }
}
```

## Итог

**Хеш в Redis** - это способ хранить объект (набор полей-значений) под одним ключом. Это удобно для:
- Профилей пользователей
- Настроек приложения
- Конфигураций
- Любых связанных данных, которые нужно хранить вместе

