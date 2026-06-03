# Компонент BookingForm.vue — форма бронирования

## 🎯 Назначение

`BookingForm.vue` — полноэкранная форма бронирования, которая:
- Собирает данные гостя (ФИО, телефон, email)
- Принимает даты заезда/выезда с валидацией
- Позволяет выбрать номер и количество человек
- Отправляет POST-запрос на API с маппингом полей
- Обрабатывает ошибки валидации от сервера (422)
- Использует глобальное состояние для подстановки `home_id`

---

## 🧱 Верстка

### Полноэкранный блок с фоном

```vue
<section class="relative h-screen overflow-hidden">
  <img :src="bgImg" class="absolute inset-0 w-full h-full object-cover" />
  <div class="absolute inset-0 bg-[#EFE6D7]/50"></div>
  <div class="relative z-10 ...">
    <!-- форма -->
  </div>
</section>
```

**Слои:**
1. `h-screen` — высота на весь экран
2. `<img>` — фоновая картинка (`object-cover` — заполняет без искажений)
3. `<div>` — полупрозрачный оверлей `bg-[#EFE6D7]/50` (затемнение фона для читаемости)
4. Контент поверх всего с `z-10`

### Сетка формы

Поля организованы в **две группы по два столбца**:
```vue
<div class="grid grid-cols-2 gap-3">
  <div>Дата заезда</div>
  <div>Дата выезда</div>
</div>
<div class="grid grid-cols-2 gap-3">
  <div>Количество человек</div>
  <div>Тип номера</div>
</div>
```

На мобильных всё выстраивается в колонку — это работает автоматически благодаря `grid-cols-2` (Tailwind сам адаптирует).

### Динамические классы для ошибок

```vue
:class="{ 'border-red-400': errors.fullName }"
```

Объектный синтаксис `:class`: ключ — имя класса, значение — условие. Если в `errors.fullName` есть текст — рамка становится красной.

---

## ️ Функциональность

### 1. Импорт и фоновое изображение

```javascript
import { ref, reactive, onMounted } from 'vue';
import { createReservation } from '@/api/reservations';
import { getHomes } from '@/api/homes';
import { selectedHomeId } from '@/composables/useBooking';
import bgImage from '@/img/bg/78d23bb27f6e27fdd19465b67210c025b56cba7c.jpg';
```

**Ключевые моменты:**
- `ref` — для простых значений (флаги, сообщения)
- `reactive` — для объектов (форма, ошибки)
- `import bgImage` — Vite обработает путь и даст правильный URL (не ломается на вложенных страницах)

### 2. Реактивная форма через `reactive`

```javascript
const form = reactive({
  fullName: '',
  phone: '',
  email: '',
  checkIn: '',
  checkOut: '',
  guests: '',
  roomType: '',
  wishes: '',
  agree: false,
});
```

**`reactive` vs `ref`:**
- `reactive` — оборачивает объект, обращение через `form.fullName` (без `.value`)
- `ref` — оборачивает примитив, обращение через `isSubmitting.value`

В шаблоне и `ref`, и `reactive` распаковываются автоматически.

### 3. Загрузка списка номеров с API

```javascript
const roomTypes = ref([]);

const loadRoomTypes = async () => {
  loadingRooms.value = true;
  try {
    const response = await getHomes();
    roomTypes.value = response.data.data.map(home => ({
      value: home.id,
      label: home.name,
    }));
  } catch (err) {
    console.error('Ошибка загрузки номеров:', err);
    // Fallback — хардкод на случай сбоя API
    roomTypes.value = [
      { value: 1, label: 'Стандартный номер' },
      { value: 2, label: 'Полулюкс' },
      { value: 3, label: 'Люкс' },
    ];
  } finally {
    loadingRooms.value = false;
  }
};

onMounted(() => loadRoomTypes());
```

**Как работает:**
1. `onMounted` — хук, срабатывает один раз после монтирования компонента
2. `getHomes()` → `response.data.data` (двойная обёртка: axios + Laravel)
3. `.map()` — трансформирует массив объектов `{id, name}` в формат для `<select>`: `{value: id, label: name}`
4. **Fallback** — если API упал, подставляем хардкод, чтобы форма не сломалась

**Почему список номеров с API?** Сервер требует реальный `home_id`. Если пользователь выберет из списка, мы сразу отправим правильный ID.

### 4. Склонение "человек/человека"

```javascript
const getGuestsWord = (n) => {
  const lastTwo = n % 100;
  const lastOne = n % 10;
  if (lastTwo >= 11 && lastTwo <= 19) return 'человек';
  if (lastOne === 1) return 'человек';
  if (lastOne >= 2 && lastOne <= 4) return 'человека';
  return 'человек';
};
```

**Логика русского склонения:**
- `11-19` всегда "человек" (одиннадцать человек, двенадцать человек)
- Остальные смотрим на последнюю цифру: `1` → человек, `2-4` → человека, `0, 5-9` → человек

**Примеры:**
- 1 → "1 человек"
- 2 → "2 человека"
- 5 → "5 человек"
- 11 → "11 человек"
- 21 → "21 человек"

### 5. Правила валидации

```javascript
const validationRules = {
  fullName: {
    required: 'Введите ФИО',
    validate: (value) => {
      const trimmed = value.trim();
      if (trimmed.length < 2) return 'ФИО должно содержать минимум 2 символа';
      if (!/^[а-яА-ЯёЁa-zA-Z\s-]+$/.test(trimmed)) return 'ФИО должно содержать только буквы';
      return null;
    },
  },
  phone: {
    required: 'Введите номер телефона',
    validate: (value) => {
      if (!/^[\d\s\-+()]{10,}$/.test(value.trim())) return 'Введите корректный номер телефона';
      return null;
    },
  },
  email: {
    required: 'Введите email',
    validate: (value) => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Введите корректный email';
      return null;
    },
  },
  checkIn: { required: 'Выберите дату заезда' },
  checkOut: { required: 'Выберите дату выезда' },
  guests: { required: 'Выберите количество человек' },
  roomType: { required: 'Выберите тип номера' },
  agree: { required: 'Необходимо дать согласие' },
};
```

**Структура правила:**
- `required` — сообщение, если поле пустое
- `validate` — функция для доп. проверки (регулярки)

**Регулярки:**
| Поле | Регулярка | Что проверяет |
|------|-----------|---------------|
| ФИО | `/^[а-яА-ЯёЁa-zA-Z\s-]+$/` | Только буквы, пробелы, дефис |
| Телефон | `/^[\d\s\-+()]{10,}$/` | Цифры, пробелы, +, -, скобки, минимум 10 символов |
| Email | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | standard email pattern |

### 6. Валидация одного поля

```javascript
const validateField = (field) => {
  const value = form[field];
  const rule = validationRules[field];
  if (!rule) return;

  // Проверка на пустоту
  const isEmpty = typeof value === 'boolean' ? !value : !String(value).trim();

  if (isEmpty) {
    errors[field] = rule.required;
    return;
  }

  // Дополнительная валидация
  if (rule.validate) {
    const error = rule.validate(value);
    if (error) {
      errors[field] = error;
    } else {
      delete errors[field];
    }
  } else {
    delete errors[field];
  }

  // Спец. проверка для дат
  if (field === 'checkIn' || field === 'checkOut') validateDates();
};
```

**Логика:**
1. Берём значение и правило из словаря
2. Проверяем пустоту (для булевых — `!value`, для строк — `!trim()`)
3. Если пусто → ставим сообщение `required`
4. Если есть `validate` → запускаем регулярку
5. Если дата → дополнительно вызываем `validateDates()`

**Когда вызывается:**
- `@blur` — когда поле теряет фокус
- `@input` / `@change` — для очистки ошибки при вводе

### 7. Валидация дат

```javascript
const validateDates = () => {
  if (!form.checkIn || !form.checkOut) return;
  const checkInDate = new Date(form.checkIn);
  const checkOutDate = new Date(form.checkOut);
  if (checkOutDate <= checkInDate) {
    errors.checkOut = 'Дата выезда должна быть позже даты заезда';
  } else {
    delete errors.checkOut;
  }
};
```

Сравниваем даты как объекты `Date`. Если выезд раньше или равен заезду — ошибка на поле `checkOut`.

### 8. Полная валидация перед отправкой

```javascript
const validateAll = () => {
  Object.keys(validationRules).forEach(validateField);
  validateDates();
  return Object.keys(errors).length === 0;
};
```

Прогоняем все поля через `validateField`, потом даты. Если объект `errors` пуст — форма валидна.

### 9. Обработчики событий в шаблоне

```vue
@blur="validateField('fullName')"
@input="clearError('fullName')"
```

| Событие | Когда срабатывает | Что делает |
|---------|-------------------|------------|
| `@blur` | Потеря фокуса | Валидирует поле |
| `@input` | Изменение текста | Стирает ошибку при новом вводе |
| `@change` | Изменение select | Стирает ошибку |
| `@submit.prevent` | Отправка формы | `prevent` отменяет стандартный submit |

### 10. Отправка формы (POST-запрос)

```javascript
const handleSubmit = async () => {
  if (!validateAll()) {
    const firstError = document.querySelector('.border-red-400');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  isSubmitting.value = true;
  successMessage.value = '';
  serverError.value = '';

  const payload = {
    fio: form.fullName,
    phone: form.phone,
    email: form.email,
    check_in_date: form.checkIn,
    check_out_date: form.checkOut,
    count_people: Number(form.guests),
    home_id: Number(form.roomType),
    comment: form.wishes || null,
  };

  try {
    await createReservation(payload);
    successMessage.value = 'Ваша заявка успешно отправлена!';
    // Сброс формы
    Object.keys(form).forEach(key => {
      form[key] = key === 'agree' ? false : '';
    });
  } catch (err) {
    // Обработка ошибок...
  } finally {
    isSubmitting.value = false;
  }
};
```

**Маппинг полей формы → API:**

| Поле формы | Поле API | Преобразование |
|------------|----------|----------------|
| `fullName` | `fio` | как есть |
| `phone` | `phone` | как есть |
| `email` | `email` | как есть |
| `checkIn` | `check_in_date` | как есть (YYYY-MM-DD) |
| `checkOut` | `check_out_date` | как есть |
| `guests` | `count_people` | `Number()` — строка → число |
| `roomType` | `home_id` | `Number()` — ID номера |
| `wishes` | `comment` | как есть или `null` |

**Почему `Number()`?** `<select>` возвращает строку `"2"`, а API ждёт число `2`. Без конвертации Laravel вернёт 422.

**Сброс формы:**
```javascript
Object.keys(form).forEach(key => {
  form[key] = key === 'agree' ? false : '';
});
```
Проходим по всем ключам, чекбокс сбрасываем в `false`, остальное — в пустую строку.

### 11. Обработка ошибок от сервера

```javascript
catch (err) {
  if (err.response?.status === 422) {
    const apiErrors = err.response.data.errors || {};
    const fieldMapping = {
      fio: 'fullName',
      phone: 'phone',
      email: 'email',
      check_in_date: 'checkIn',
      check_out_date: 'checkOut',
      count_people: 'guests',
      home_id: 'roomType',
    };

    Object.keys(errors).forEach(key => delete errors[key]);
    Object.keys(apiErrors).forEach(apiField => {
      const formField = fieldMapping[apiField] || apiField;
      errors[formField] = apiErrors[apiField][0];
    });
  } else if (err.response?.status === 500) {
    serverError.value = 'Ошибка сервера. Пожалуйста, попробуйте позже.';
  } else {
    serverError.value = 'Не удалось отправить заявку. Проверьте соединение с сетью.';
  }
}
```

**Логика обработки:**

| Статус | Что произошло | Что делаем |
|--------|---------------|------------|
| `422` | Ошибки валидации Laravel | Маппим поля API на поля формы, показываем под соответствующими инпутами |
| `500` | Ошибка на сервере | Показываем общее сообщение |
| Другой | Сетевая проблема | Показываем общее сообщение |

**Маппинг ошибок 422:**
Laravel возвращает:
```json
{
  "errors": {
    "fio": ["ФИО обязательно"],
    "home_id": ["Поле обязательно"]
  }
}
```

Мы берём `fieldMapping['fio']` → получаем `'fullName'` → записываем ошибку в `errors.fullName`.

### 12. Глобальное состояние через composable

```javascript
import { selectedHomeId } from '@/composables/useBooking';
```

В `handleSubmit` используется:
```javascript
home_id: Number(form.roomType),
```

Но в обновлённой версии используется `selectedHomeId.value` — если пользователь зашёл со страницы `/rooms/1`, ID подставится автоматически. Composable `useBooking.js`:

```javascript
export const selectedHomeId = ref(null);
export function setSelectedHomeId(id) {
  selectedHomeId.value = id ? Number(id) : null;
}
```

В `HomeDetail.vue` после загрузки вызывается `setSelectedHomeId(home.value.id)`.

---

## 🎨 Стили

### `.booking-input`

```css
.booking-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 6px;
  color: #EFE6D7;
  font-family: 'Montserrat', sans-serif;
}
```

Полупрозрачная рамка, светлый текст на тёмном фоне формы.

### Кастомная стрелка для `<select>`

```css
.booking-input.appearance-none {
  background-image: url("data:image/svg+xml,...");
  background-position: right 12px center;
  padding-right: 40px;
}
```

`appearance-none` убирает стандартную стрелку браузера, заменяем её на свою SVG через `background-image`.

### Инверсия иконки календаря

```css
.booking-input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
}
```

Стандартная иконка календаря тёмная — на тёмном фоне не видно. `invert(1)` делает её белой.

### Кастомный скроллбар

```css
form::-webkit-scrollbar { width: 6px; }
form::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.3); border-radius: 3px; }
```

Если форма не влезает в экран — появляется тонкий полупрозрачный скроллбар внутри формы (не на всей странице).

---

## 🔗 Связи с другими компонентами

```
App.vue
  └─ BookingForm.vue
       ├─ useBooking.js ← глобальное состояние (selectedHomeId)
       ├─ api/reservations.js ← POST /reservations
       ├─ api/homes.js ← GET /homes (для списка номеров)
       └─ HomeDetail.vue ← вызывает setSelectedHomeId()
```

---

## 🧠 Ключевые концепции

1. **`reactive` для объектов формы** — удобно работать с вложенными полями
2. **Словарь правил валидации** — централизованная логика, легко расширять
3. **Маппинг полей формы → API** — разные имена на фронте и бэке
4. **Обработка 422 ошибок** — автоматическая подсветка полей от сервера
5. **Fallback при загрузке API** — форма работает даже если API упал
6. **Composable для глобального состояния** — передача `home_id` между компонентами без пропсов
7. **Склонение числительных** — модульная арифметика для русского языка

---

## 🐛 Типичные баги

1. **`count_people` как строка** → Laravel возвращает 422. Решение: `Number(form.guests)`
2. **Путь картинки `/src/img/...`** → ломается на `/rooms/1`. Решение: `import` через Vite
3. **Забыл `delete errors[field]`** → ошибка остаётся после исправления. Решение: очищать в `@input`
4. **Не сбросил `isSubmitting`** → кнопка навсегда "Отправка...". Решение: `finally { isSubmitting = false }`
5. **`reactive` деструктурирован без `toRefs`** → теряется реактивность. Решение: обращаться как `form.field`, не деструктурировать