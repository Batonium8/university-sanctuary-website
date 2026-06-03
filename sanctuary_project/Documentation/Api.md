# Сервисный слой API — архитектура и теория

##  Назначение

Файлы `homes.js`, `services.js`, `medicalStaff.js`, `reservations.js` — это **сервисный слой** (service layer) приложения. Они находятся в папке `src/api/` и отвечают за **всё общение с бэкендом**.

Vue-компоненты никогда не делают запросы напрямую. Они импортируют функции из этих файлов и вызывают их. Это принцип **разделения ответственности**: компонент думает о UI, сервисный слой — о данных.

---

##  REST API — теория

Бэкенд построен по архитектуре **REST** (Representational State Transfer). Это набор правил, как общаться с сервером через HTTP.

### Основные HTTP-методы

| Метод | Назначение | Пример из проекта | Аналогия |
|-------|------------|-------------------|----------|
| **GET** | Получить данные | `getHomes()`, `getServiceById(1)` | «Покажи список» |
| **POST** | Создать новую запись | `createReservation(data)` | «Добавь новую бронь» |
| **PUT** | Полностью обновить запись | (в проекте не используется) | «Замени целиком» |
| **PATCH** | Частично обновить запись | (в проекте не используется) | «Поправь одно поле» |
| **DELETE** | Удалить запись | (в проекте не используется) | «Удали» |

### Структура URL (эндпоинты)

REST предполагает, что URL — это **существительное** (ресурс), а метод — **глагол** (действие):

```
GET    /homes           → список всех номеров
GET    /homes/1         → конкретный номер с id=1
POST   /reservations    → создать бронь
GET    /medical-staff   → список персонала
GET    /medical-staff/5 → конкретный сотрудник
```

Никаких `/getHomes` или `/createReservation` в URL быть не должно — это антипаттерн. Метод уже говорит, что мы делаем.

---

## Разбор файлов

### 1. `homes.js` — работа с номерами

```javascript
import apiClient from '../client.js';

export const getHomes = () => {
  return apiClient.get('/homes');
};

export const getHomeById = (id) => {
  return apiClient.get(`/homes/${id}`);
};
```

**Две функции = два эндпоинта:**
- `getHomes()` → `GET /homes` — возвращает массив всех номеров
- `getHomeById(id)` → `GET /homes/1` — возвращает один объект

**Шаблонные строки** (обратные кавычки `` ` ``): позволяют вставлять переменные внутрь строки через `${}`. Без них пришлось бы писать `'/homes/' + id`.

### 2. `services.js` — работа с услугами

```javascript
export const getServices = () => {
  return apiClient.get('/services');
};

export const getServiceById = (id) => {
  return apiClient.get(`/services/${id}`);
};
```

Та же структура, что и `homes.js`. **Паттерн повторяется** — это нормально, каждый ресурс имеет свой файл.

### 3. `medicalStaff.js` — работа с персоналом

```javascript
export const getMedicalStaff = () => {
  return apiClient.get('/medical-staff');
};

export const getMedicalStaffById = (id) => {
  return apiClient.get(`/medical-staff/${id}`);
};
```

Обрати внимание: URL — `/medical-staff`, а не `/medicalStaff`. **KEBAB-CASE** (через дефис) — стандарт для URL в REST API. CamelCase используется только в JS-коде.

### 4. `reservations.js` — создание брони

```javascript
export const createReservation = (data) => {
  return apiClient.post('/reservations', data);
};
```

Единственная функция, потому что в нашем проекте админка не реализована — мы только **создаём** брони, но не получаем/не удаляем их с фронта.

Второй аргумент `data` в `apiClient.post(url, data)` — это **тело запроса** (request body). Оно автоматически сериализуется в JSON и летит на сервер.

---

##  Почему Axios, а не `fetch`?

В файле `client.js` (который импортируется везде) создан **Axios-инстанс**:

```javascript
const apiClient = axios.create({
  baseURL: '/sanatorium/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});
```

**Что это даёт:**

| Возможность | Axios | `fetch` |
|-------------|-------|---------|
| Автоматическая конвертация JSON | ✅ | ❌ (нужен `.json()`) |
| Таймаут запроса | ✅ из коробки | ❌ (нужен `AbortController`) |
| Интерцепторы (перехват запросов/ответов) | ✅ | ❌ |
| Автоматическая обработка ошибок 4xx/5xx | ✅ (бросает ошибку) | ❌ (считает 404 "успехом") |
| Базовый URL для всех запросов | ✅ | ❌ |
| Размер пакета | ~13 КБ | 0 (встроен в браузер) |

**Главное преимущество для нас:** `baseURL`. Мы пишем `apiClient.get('/homes')`, а Axios сам склеивает это с `'/sanatorium/api/v1'` → получается `'/sanatorium/api/v1/homes'`. Без Axios пришлось бы в каждом файле дублировать полный путь.

---

## JSDoc-комментарии

В каждом файле есть блоки вроде:

```javascript
/**
 * Получить список всех номеров/коттеджей
 * @returns {Promise} - массив объектов Home
 * Структура объекта: { id, name, description, images, capacity, costs }
 */
```

Это **JSDoc** — стандарт документации для JavaScript. Он:
- Показывает подсказки в IDE (WebStorm, VS Code)
- Позволяет видеть тип возвращаемого значения без открытия файла
- Работает как "контракт" — разработчик сразу видит, что вернёт функция

---

## (named) Экспорт

```javascript
export const getHomes = () => { ... }
```

Ключевое слово `export` делает функцию доступной для импорта в других файлах. Это **именованный экспорт** (named export) — при импорте нужно указать точное имя:

```javascript
import { getHomes } from '@/api/homes';
```

Альтернатива — `export default`, но для сервисного слоя она не подходит: в одном файле может быть несколько функций (`getHomes` и `getHomeById`), а `default` может быть только один.

---

## Поток данных (Data Flow)

Как всё связано:

```
Vue-компонент (Rooms.vue)
   │
   │  import { getHomes } from '@/api/homes'
   │  const response = await getHomes()
   │
   ▼
homes.js (сервисный слой)
   │
   │  return apiClient.get('/homes')
   │
   ▼
client.js (Axios-инстанс)
   │
   │  baseURL + '/homes' = '/sanatorium/api/v1/homes'
   │
   ▼
Vite proxy (vite.config.js)
   │
   │  перенаправляет на https://sites.creatrix-digital.ru/sanatorium/api/v1/homes
   │
   ▼
Laravel-бэкенд
   │
   │  возвращает JSON: { data: [...], meta: {...} }
   │
   ▼
Компонент получает: response.data.data
   │                    ↑            ↑
   │                  axios        Laravel
   │                  обёртка      API Resource
   │
   ▼
rooms.value = response.data.data || []
```

**Двойная обёртка `data.data`** — ключевой момент, с которым мы мучились в начале:
- Первый `.data` — от Axios (свойство объекта ответа)
- Второй `.data` — от Laravel API Resource (стандарт JSON:API)

---

## Принципы, которые соблюдены

1. **Single Responsibility** — один файл = одна сущность (homes, services, staff, reservations)
2. **DRY (Don't Repeat Yourself)** — `baseURL` задан один раз в `client.js`, не дублируется в каждом файле
3. **Разделение слоёв** — компоненты не знают про URL, сервисный слой не знает про UI
4. **Async/await** — все функции возвращают `Promise`, вызывающий код сам решает, как обрабатывать результат
5. **Отсутствие бизнес-логики** — сервисный слой только передаёт данные, не трансформирует их (это делает компонент)

---

## Типичные ошибки при работе с сервисным слоем

| Ошибка | Симптом | Решение |
|--------|---------|---------|
| Забыл `await` перед вызовом функции | В переменной лежит Promise, а не данные | Всегда `await` или `.then()` |
| Забыл `.data` у ответа | Пытаешься читать `response.name` вместо `response.data.name` | Помни про двойную обёртку |
| Хардкодишь URL в компоненте | При смене бэкенда придётся менять 10 файлов | Всегда через сервисный слой |
| Делаешь запрос в `setup()` без `onMounted` | SSR-проблемы, двойные запросы | Запросы — в `onMounted` или по действию пользователя |
| Не обрабатываешь ошибки | Приложение падает при сбое сети | Всегда `try/catch` в компоненте |


