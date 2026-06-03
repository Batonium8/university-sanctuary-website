# Компоненты Rooms.vue, RoomCard.vue и HomeDetail.vue — карусель номеров и детальная страница

## 🎯 Назначение

Эти три компонента работают в связке:
- **`Rooms.vue`** — секция на главной странице, загружает список номеров с API и показывает их в карусели Swiper
- **`RoomCard.vue`** — «глупый» презентационный компонент, просто отображает одну карточку
- **`HomeDetail.vue`** — отдельная страница с подробной информацией о выбранном номере

---

## 🧩 RoomCard.vue — «глупый» компонент

### Верстка

Карточка состоит из двух частей, которые на десктопе встают в ряд:

```vue
<div class="flex flex-col md:flex-row rounded-lg overflow-hidden">
  <div class="md:w-[35%]">
    <img :src="imageUrl" class="w-full h-full object-cover" />
  </div>
  <div class="flex-1 bg-[#777C5C] text-[#EFE6D7]">
    <h3>{{ title }}</h3>
    <p>{{ capacity }}</p>
    <p>{{ description }}</p>
    <div class="flex justify-between mt-auto">
      <span>{{ price }}</span>
      <button @click="$emit('details-click')">Подробнее</button>
    </div>
  </div>
</div>
```

**Ключевые приёмы:**
- `md:flex-row` — на мобильных колонка, на десктопе ряд
- `md:w-[35%]` — картинка занимает 35% ширины на десктопе
- `flex-1` — текстовая часть занимает оставшееся место
- `mt-auto` — блок с ценой и кнопкой прижимается к низу карточки (полезно, если карточки разной высоты)
- `object-cover` — картинка заполняет блок без искажений

### Функциональность: пропсы и emits

```javascript
defineProps({
  title: { type: String, required: true },
  capacity: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

defineEmits(['details-click']);
```

**Принцип «однонаправленного потока данных»:**
- **Пропсы** (`title`, `price`...) — данные идут **сверху вниз** (от родителя к ребёнку). Ребёнок не должен их менять.
- **Emits** (`details-click`) — события идут **снизу вверх**. Ребёнок говорит родителю: «Меня кликнули, делай что хочешь».

В шаблоне: `@click="$emit('details-click')"` — при клике на кнопку компонент отправляет событие наверх. Родитель ловит его через `@details-click="handleDetailsClick(room.id)"`.

**Почему так?** RoomCard не знает про роутер, API и переходы. Он просто кнопка с текстом. Это делает его **переиспользуемым** — можно вставить в любое место проекта.

---

## 🧠 Rooms.vue — секция карусели

### Верстка: три состояния

```vue
<div v-if="loading">Загрузка...</div>
<div v-else-if="error">
  <p>{{ error }}</p>
  <button @click="loadRooms">Попробовать снова</button>
</div>
<div v-else-if="rooms.length > 0">
  <Swiper>...</Swiper>
</div>
<div v-else>Номера временно недоступны</div>
```

Классический UX-паттерн. Пользователь всегда видит одно из четырёх состояний: загрузка, ошибка с кнопкой повтора, данные, или «пусто».

### Загрузка данных с API

```javascript
const loadRooms = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await getHomes();
    rooms.value = response.data.data || [];
  } catch (err) {
    error.value = 'Не удалось загрузить номера. Попробуйте позже.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => { loadRooms(); });
```

Всё по стандарту: хук `onMounted` запускает запрос, `response.data.data` — двойная обёртка axios + Laravel. `|| []` страхует от null.

### Swiper: группировка карточек

```vue
<Swiper
  :key="groupSize"
  :modules="modules"
  :space-between="24"
  :slides-per-view="1"
  :pagination="{ clickable: true }"
>
  <SwiperSlide v-for="(group, index) in groupedRooms" :key="index">
    <RoomCard v-for="room in group" ... />
  </SwiperSlide>
</Swiper>
```

**Как работает группировка:**
```javascript
const groupedRooms = computed(() => {
  const size = groupSize.value;  // 1, 2 или 3
  const groups = [];
  for (let i = 0; i < rooms.value.length; i += size) {
    groups.push(rooms.value.slice(i, i + size));
  }
  return groups;
});
```

Если в базе 9 номеров и `groupSize = 3`, получится 3 группы по 3 карточки. Swiper листает **группами**, а не по одной карточке.

**Зачем `:key="groupSize"`?** Когда пользователь меняет размер окна (с десктопа на мобильный), `groupSize` меняется с 3 на 1. Vue видит новый `key`, **уничтожает старый Swiper** и создаёт новый с правильными параметрами. Без этого Swiper мог бы «залипнуть» со старой конфигурацией.

### Адаптивность через resize

```javascript
const getGroupSize = () => {
  if (window.innerWidth >= 1024) return 3;   // lg: 3 карточки
  if (window.innerWidth >= 768) return 2;    // md: 2 карточки
  return 1;                                  // мобильный: 1 карточка
};

const handleResize = () => {
  const newSize = getGroupSize();
  if (newSize !== groupSize.value) {
    groupSize.value = newSize;
  }
};

onMounted(() => {
  groupSize.value = getGroupSize();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
```

**Важные детали:**
1. Проверяем `newSize !== groupSize.value` перед изменением — лишние перерисовки не нужны
2. **Обязательно убираем слушатель** в `onUnmounted`, иначе будет утечка памяти
3. `getGroupSize()` вызывается сразу при монтировании, чтобы установить правильное начальное значение

### Переход на детальную страницу

```javascript
const handleDetailsClick = (roomId) => {
  router.push({ name: 'HomeDetail', params: { id: roomId } });
};
```

Программный переход через Vue Router. `name: 'HomeDetail'` — именованный маршрут (если в роутере поменяют URL с `/rooms/:id` на `/number/:id`, код не сломается).

### Вспомогательные функции

**Форматирование цены:**
```javascript
const formatPrice = (price) => {
  const num = Number(price);
  if (isNaN(num)) return `${price} руб`;
  return `${num.toLocaleString('ru-RU')} руб`;  // 3500 → "3 500 руб"
};
```

**Склонение «человек/человека»:**
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

Модульная арифметика для русского языка. Работает для любого числа.

**Короткое описание:**
```javascript
const getShortDescription = (description) => {
  if (!description) return '';
  return description.length > 100 
    ? description.substring(0, 100) + '...' 
    : description;
};
```

Если у номера нет `short_description`, берём первые 100 символов полного описания. `room.short_description || getShortDescription(room.description)` — оператор `||` подставляет fallback.

### Стили пагинации Swiper

```css
.rooms-swiper :deep(.swiper-pagination-bullet) {
  background: #142C12;
  opacity: 0.3;
}
:deep(.swiper-pagination-bullet-active) {
  opacity: 1;
  width: 28px;
  border-radius: 5px;
}
```

**`:deep()`** — специальный селектор Vue для стилизации дочерних компонентов. Swiper рендерит свои элементы внутри своего Shadow DOM, обычный CSS до них не доберётся. `:deep()` пробивает эту изоляцию.

Активная точка растягивается в полоску (`width: 28px`, `border-radius: 5px`) — современный UI-паттерн.

---

## 📄 HomeDetail.vue — детальная страница номера

### Верстка: галерея + информация

```vue
<section class="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-[#EFE6D7] !pt-32 min-h-screen">
  <div class="max-w-6xl mx-auto">
    <!-- Три состояния: loading / error / данные -->
    <div v-else-if="home" class="flex flex-col lg:flex-row gap-8 lg:gap-12">
      <!-- Левая колонка: галерея -->
      <div class="lg:w-1/2">
        <div class="rounded-lg overflow-hidden mb-3 bg-[#D9D0C1]">
          <img :src="home.images[0]" class="w-full h-[300px] md:h-[400px] object-cover" />
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div v-for="(image, index) in home.images.slice(1, 4)">
            <img :src="image" class="w-full h-[100px] md:h-[120px] object-cover" />
          </div>
        </div>
      </div>
      <!-- Правая колонка: текст -->
      <div class="lg:w-1/2 flex flex-col">
        <h1>{{ home.name }}</h1>
        <div class="flex flex-wrap gap-4">
          <div v-if="home.capacity">Вместимость: {{ home.capacity }} человека</div>
          <div v-if="home.area">Площадь: {{ home.area }} м²</div>
        </div>
        <div class="flex-1 mb-8">
          <p>{{ home.description }}</p>
        </div>
        <div class="mt-auto">
          <div class="text-3xl md:text-4xl">{{ formatPrice(home.costs) }}</div>
        </div>
      </div>
    </div>
  </div>
</section>
```

**Ключевые моменты вёрстки:**
- `!pt-32` — восклицательный знак в Tailwind **принудительно** применяет отступ, перебивая другие правила. Нужно, чтобы фиксированный Header не перекрыл заголовок
- `min-h-screen` — страница занимает минимум весь экран, футер не подпрыгивает вверх
- `flex-col lg:flex-row` — на мобильном колонка, на десктопе ряд
- `lg:w-1/2` — колонки делят экран пополам
- `flex-1` в правой колонке — описание растягивается, прижимая цену к низу через `mt-auto` у родителя
- `bg-[#D9D0C1]` у контейнеров картинок — цветной плейсхолдер, пока картинка грузится
- `home.images.slice(1, 4)` — берём 2-е, 3-е и 4-е фото для миниатюр

### Функциональность: загрузка данных

```javascript
const loadHome = async (id) => {
  if (!id) return;

  loading.value = true;
  error.value = null;
  home.value = null;  // ← важно!

  try {
    const response = await getHomeById(id);
    home.value = response.data.data;
    setSelectedHomeId(home.value.id);  // ← composable
  } catch (err) {
    if (err.response?.status === 404) error.value = 'Номер не найден.';
    else if (err.response?.status === 500) error.value = 'Ошибка сервера.';
    else error.value = 'Не удалось загрузить информацию.';
  } finally {
    loading.value = false;
  }
};
```

**Зачем `home.value = null`?** Если пользователь перешёл с `/rooms/1` на `/rooms/2`, компонент не пересоздаётся. Если не сбросить `home`, пользователь на долю секунды увидит данные первого номера, пока грузятся данные второго. Сброс в `null` заставляет Vue скрыть контент и показать спиннер.

**Обработка ошибок по статусам:**
- `404` — номер удалён или не существует
- `500` — проблема на бэкенде
- Другое — сетевая ошибка (нет интернета, CORS и т.д.)

### Composable для глобального состояния

```javascript
import { setSelectedHomeId } from '@/composables/useBooking';

// В loadHome, после успешной загрузки:
setSelectedHomeId(home.value.id);
```

**Зачем это нужно?** Когда пользователь находится на странице `/rooms/1` и заполняет форму бронирования, форма должна знать, какой номер выбран. Composable `useBooking.js` хранит `selectedHomeId` в глобальном реактивном ref, доступном всем компонентам.

```javascript
// useBooking.js
export const selectedHomeId = ref(null);
export function setSelectedHomeId(id) {
  selectedHomeId.value = id ? Number(id) : null;
}
```

BookingForm импортирует `selectedHomeId` и использует его значение при отправке: `home_id: selectedHomeId.value`.

### Watch на параметры роута

```javascript
onMounted(() => {
  loadHome(route.params.id);
});

watch(() => route.params.id, (newId) => {
  loadHome(newId);
});
```

**Почему два вызова?**
- `onMounted` — загружает данные **при первом открытии** страницы
- `watch` — следит за изменением `id` в URL. Если пользователь кликнул по рекомендации и перешёл с `/rooms/1` на `/rooms/2`, компонент не пересоздаётся, `onMounted` не сработает второй раз. `watch` ловит изменение и перезагружает данные.

### Форматирование цены

```javascript
const formatPrice = (price) => {
  const num = Number(price);
  if (isNaN(num)) return `${price} руб`;
  return `${num.toLocaleString('ru-RU')} руб`;
};
```

API возвращает цену как строку `"3500.00"`. `Number()` превращает в число, `toLocaleString('ru-RU')` форматирует по-русски: `3500` → `"3 500"`. Получается `"3 500 руб"` вместо `"3500.00 руб"`.

---

## 🔗 Связи между компонентами

```
Главная страница (HomeView)
  └─ Rooms.vue
       ├─ getHomes() → API
       ├─ v-for → RoomCard (пропсы: title, price, imageUrl...)
       │              └─ @details-click → handleDetailsClick(roomId)
       │                                      └─ router.push({ name: 'HomeDetail', params: { id } })
       │
       ─ Swiper (группировка через computed groupedRooms)

Страница /rooms/:id
  └─ HomeDetailsView (обёртка)
       ├─ HomeDetail.vue
       │    ├─ getHomeById(id) → API
       │    ├─ setSelectedHomeId(home.id) → useBooking composable
       │    └─ Галерея: images[0] + images.slice(1, 4)
       │
       ─ BookingForm.vue
            └─ selectedHomeId (из composable) → home_id в POST-запросе
```

---

## 🧠 Ключевые концепции

1. **Props + Emits паттерн** — однонаправленный поток данных. Родитель передаёт данные, ребёнок шлёт события
2. **Группировка массива через `computed`** — Swiper листает группами, а не по одной карточке
3. **`:key` для пересоздания компонента** — когда меняется `groupSize`, Swiper полностью пересоздаётся
4. **Resize listener с очисткой** — адаптивная группировка с правильной очисткой слушателя
5. **Сброс данных перед запросом** (`home.value = null`) — защита от «мигания» старых данных
6. **Composable для глобального состояния** — передача `home_id` между компонентами без пропсов
7. **`:deep()` селектор** — стилизация дочерних компонентов (Swiper)
8. **`toLocaleString('ru-RU')`** — правильное форматирование чисел по-русски
9. **Модульная арифметика для склонений** — универсальное решение для русского языка

---

## 🐛 Типичные баги

1. **Swiper «залипает» при resize** → забыл `:key="groupSize"`, компонент не пересоздаётся
2. **Утечка памяти** → забыл `removeEventListener('resize')` в `onUnmounted`
3. **Мигание старых данных** при переходе между номерами → забыл `home.value = null` перед запросом
4. **`count_people` как строка** в API → Laravel вернёт 422. Решение: `Number()`
5. **Стили Swiper не применяются** → забыл `:deep()` селектор
6. **`v-for` без `:key`** → Vue ругается, странное поведение списка
7. **Путь картинки `/src/img/...`** → ломается на вложенных URL. Решение: `import` через Vite или `public/`