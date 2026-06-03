# Компоненты Doctors.vue и DoctorDetail.vue — персонал и страница врача

## 🎯 Назначение

Эти два компонента работают в паре:
- **`Doctors.vue`** показывает список врачей и медперсонала в секции на главной странице.
- **`DoctorDetail.vue`** — это отдельная страница с подробной биографией, фото и сертификатами конкретного специалиста.

---

## 🧩 Doctors.vue — список персонала

### Верстка: Хитрый макет с разделением на два ряда

На десктопе список врачей выглядит как сетка, где **первые три карточки** стоят в ряд вместе с текстом-описанием, а **все остальные** (если их больше трех) уходят во второй ряд.

```vue
<!-- Первый ряд -->
<div class="flex overflow-x-auto ... lg:grid lg:grid-cols-4 ...">
  <router-link v-for="item in staff.slice(0, 3)">
    <ServicesCard ... />
  </router-link>
  
  <!-- Текст-описание, который влезает в 4-ю колонку -->
  <div class="hidden lg:flex items-start ...">
    <p>В санатории "Чистый Воздух" трудится...</p>
  </div>
</div>

<!-- Второй ряд (появляется только если врачей > 3) -->
<div v-if="staff.length > 3" class="...">
  <router-link v-for="item in staff.slice(3)">
    <ServicesCard ... />
  </router-link>
</div>
```

**Как это работает:**
- **`staff.slice(0, 3)`** — берет первые 3 элемента массива.
- **`staff.slice(3)`** — берет все элементы, начиная с 4-го и до конца.
- **`hidden lg:flex`** — текст описания полностью скрыт на мобильных (`hidden`), но на больших экранах (`lg:`) он становится флекс-блоком и занимает свободное место в сетке.

### Функциональность: Загрузка с API

```javascript
import { getMedicalStaff } from '@/api/medicalStaff';

const staff = ref([]);

const loadStaff = async () => {
  try {
    const response = await getMedicalStaff();
    staff.value = response.data.data || [];
  } catch (err) {
    console.error('Ошибка загрузки персонала:', err);
  }
};

onMounted(() => { loadStaff(); });
```

Всё по классике: при монтировании компонента делаем запрос к Laravel. Двойная обёртка `response.data.data` (axios + API Resource). Если API вернёт пустоту, подстрахуемся пустым массивом `|| []`, чтобы `v-for` не сломался.

**Важно про поля API:** В моковых данных у нас было `item.name` и `item.specialty`, но API возвращает `item.fio` (ФИО) и `item.specialization`. В шаблоне карточек мы передаем правильные поля:
```vue
<ServicesCard :image="item.profile_image" :title="item.fio" :description="item.specialization" />
```

---

##  DoctorDetail.vue — страница одного врача

### Верстка: Сложная сетка для фото и сертификатов

Самая интересная часть здесь — левая колонка с фотографиями.

```vue
<div class="grid grid-cols-3 gap-3">
  <!-- Большое фото занимает 2 колонки и 2 строки -->
  <div class="col-span-2 row-span-2 ...">
    <img :src="staff.profile_image" />
  </div>

  <!-- Сертификаты занимают 1 колонку и по 1 строке -->
  <div v-for="certificate in staff.certificates.slice(0, 2)">
    <img :src="certificate" />
  </div>
</div>
```

**Tailwind Grid в действии:**
- `grid-cols-3` — делим блок на 3 колонки.
- `col-span-2 row-span-2` — главное фото растягивается на 2 колонки в ширину и на 2 строки в высоту.
- Сертификаты автоматически заполняют оставшееся свободное место справа (по 1 ячейке каждый). Получается красивая "плитка".

### Функциональность: Паттерн "Три состояния"

Как и в `ServiceDetail`, тут используется классический UX-паттерн загрузки данных. В шаблоне мы показываем **только один** из трёх блоков:

```vue
<div v-if="loading">
  <p class="animate-pulse">Загрузка...</p>
</div>

<div v-else-if="error">
  <p>{{ error }}</p>
  <button @click="loadStaff(route.params.id)">Попробовать снова</button>
</div>

<div v-else-if="staff">
  <!-- Контент: фото, ФИО, описание -->
</div>
```

**Логика функции загрузки:**
```javascript
const loadStaff = async (id) => {
  if (!id) return;

  loading.value = true;
  error.value = null;
  staff.value = null; // Сбрасываем старые данные

  try {
    const response = await getMedicalStaffById(id);
    staff.value = response.data.data;
  } catch (err) {
    if (err.response?.status === 404) {
      error.value = 'Специалист не найден.';
    } else {
      error.value = 'Не удалось загрузить информацию.';
    }
  } finally {
    loading.value = false; // Выключается всегда, даже при ошибке
  }
};
```

**Зачем `staff.value = null` в начале?** 
Чтобы избежать "мигания". Если пользователь перешел со страницы врача Петрова на врача Сидорова, компонент не пересоздается, а просто обновляется. Если не сбросить `staff`, пользователь на долю секунды увидит данные Петрова, пока грузятся данные Сидорова. Сброс в `null` заставляет Vue скрыть контент и показать спиннер.

### Магия `watch` для навигации

```javascript
onMounted(() => {
  loadStaff(route.params.id);
});

watch(() => route.params.id, (newId) => {
  loadStaff(newId);
});
```

Если пользователь кликает по рекомендациям и переходит с `/staff/1` на `/staff/2`, URL меняется, но компонент `DoctorDetail` в памяти остается тем же. `onMounted` второй раз не сработает. Поэтому мы ставим "наблюдателя" (`watch`) на параметр `id` в адресной строке. Как только `id` меняется — observer вызывает `loadStaff` заново.

---

## 🧠 Ключевые концепции

1. **`Array.slice()` для верстки** — позволяет разбить один массив данных на две разные визуальные группы в шаблоне.
2. **CSS Grid Spans (`col-span`, `row-span`)** — лучший способ делать сложные "журнальные" раскладки картинок без боли.
3. **Условный рендеринг состояний (`v-if / v-else-if`)** — стандарт де-факто для страниц, которые зависят от API.
4. **`watch` на `route.params`** — обязательный паттерн в Vue Router, чтобы переходы между однотипными страницами (`/staff/1` -> `/staff/2`) работали без перезагрузки всего приложения.
5. **Очистка данных перед запросом** (`staff.value = null`) — защита от UX-артефактов (показа старых данных).