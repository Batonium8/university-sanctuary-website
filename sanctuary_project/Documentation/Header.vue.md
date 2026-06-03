# Компонент Header.vue — навигационная шапка сайта

##  Назначение

`Header.vue` — фиксированная шапка сайта, которая:
- Показывает логотип (клик → главная страница)
- Даёт навигацию по разделам (О нас, Услуги, Номера...)
- Содержит CTA-кнопку «Записаться»
- Меняет стиль при скролле (прозрачная → стеклянная)
- Адаптируется под мобильные устройства (бургер-меню)

---

## 📁 Структура Single File Component (SFC)

```
┌──────────────────────────┐
│ <template>               │ ← РАЗМЕТКА (что отображается)
──────────────────────────┤
│ <script setup>           │ ← ЛОГИКА (как работает)
├──────────────────────────┤
│ <style scoped>           │ ← СТИЛИ (как выглядит)
└──────────────────────────┘
```

Всё, что относится к компоненту, в одном файле. Открыл — увидел всю анатомию.

---

## 🧱 Разбор шаблона

### Корневой `<header>` — фиксированная панель

```vue
<header
  class="fixed top-0 left-0 w-full z-50 border-b border-transparent 
         transition-[background-color,border-color,backdrop-filter,box-shadow] duration-300"
  :class="isScrolled ? 'bg-[#EFE6D7]/90 backdrop-blur-md ...' : 'bg-transparent'"
>
```

| Атрибут | Назначение |
|---------|------------|
| `fixed top-0 left-0 w-full` | Прилипает к верху на всю ширину |
| `z-50` | Слой выше остального контента |
| `transition-[...] duration-300` | Плавная смена стилей за 300мс |

**Динамический класс `:class`** — тернарный оператор: если `isScrolled = true`, применяем стеклянный стиль (полупрозрачный фон + blur + тень), иначе — прозрачный. Это **glassmorphism** — современный UI-паттерн.

### Контейнер

```vue
<div class="container mx-auto px-5 md:px-8 flex items-center justify-between">
```

- `container mx-auto` — центрирование с ограничением ширины
- `flex justify-between` — логотип слева, кнопка справа, навигация по центру
- `px-5 md:px-8` — адаптивные отступы

### Логотип (мобильный)

```vue
<router-link to="/" class="text-xl font-bold md:hidden">Чистый воздух</router-link>
```

- `<router-link>` — умная ссылка Vue Router, не перезагружает страницу (в отличие от `<a>`)
- `md:hidden` — показывается только на мобильных

### Десктопная навигация

```vue
<nav aria-label="Главное меню" class="hidden md:flex items-center gap-12">
  <router-link
    v-for="link in navLinks"
    :key="link.path"
    :to="link.path"
    active-class="text-[#31542D] font-semibold"
  >
    {{ link.name }}
  </router-link>
</nav>
```

**Как работает:**
- `v-for="link in navLinks"` — цикл по массиву, создаёт ссылку для каждого пункта
- `:key="link.path"` — уникальный ключ (обязателен для `v-for`)
- `:to="link.path"` — динамический путь из данных
- `active-class` — автоматически подсвечивает ссылку текущей страницы
- `aria-label` — для скринридеров (доступность)

### Кнопка «Записаться»

```vue
<router-link
  to="/#contacts"
  class="hidden md:inline-flex bg-[#777C5C] text-[#EFE6D7] px-6 py-2.5 rounded-lg 
         shadow-sm hover:shadow-md hover:bg-[#6a6f52]"
>
  Записаться
</router-link>
```

CTA-кнопка. При наведении плавно меняется тень и цвет фона за 300мс.

### Бургер-кнопка (мобильная)

```vue
<button @click="mobileMenuOpen = !mobileMenuOpen">
  <svg v-if="!mobileMenuOpen">☰</svg>
  <svg v-else>✕</svg>
</button>
```

- `@click="mobileMenuOpen = !mobileMenuOpen"` — **toggle**: инвертирует булево значение
- `v-if / v-else` — показывает одну из двух иконок
- `md:hidden` — только на мобильных

### Мобильное меню с анимацией

```vue
<Transition name="mobile-menu">
  <div v-if="mobileMenuOpen" class="fixed inset-0 z-40 bg-[#EFE6D7]">
    <!-- ссылки -->
  </div>
</Transition>
```

`<Transition>` — встроенный компонент Vue для анимаций. При изменении `v-if` Vue автоматически добавляет CSS-классы:

```
enter-from (opacity: 0, сдвиг вверх -12px)
    ↓
enter-active (transition 0.3s)
    ↓
enter-to (opacity: 1, на месте)
```

Результат: меню плавно выезжает сверху.

---

## ⚙️ Разбор логики

### Реактивные переменные

```javascript
const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
```

`ref()` делает значение **реактивным** — при изменении Vue автоматически перерисовывает шаблон.

- В скрипте: `isScrolled.value = true`
- В шаблоне: `{{ isScrolled }}` (Vue сам «распаковывает» ref)

### Массив ссылок

```javascript
const navLinks = ref([
  { name: 'О нас', path: '#about' },
  { name: 'Услуги', path: '#services' },
  // ...
])
```

Данные отдельно от отображения — принцип **DRY** (Don't Repeat Yourself). Меняешь массив — изменения появляются везде, где используется `v-for`.

### Watcher — блокировка скролла

```javascript
watch(mobileMenuOpen, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})
```

`watch` — наблюдатель. Следит за переменной и вызывает функцию при её изменении.

**Зачем:** когда открыто меню, страница не должна прокручиваться под ним — это раздражает. `overflow: hidden` на `body` блокирует скролл.

### Обработчик скролла

```javascript
const handleScroll = () => {
  isScrolled.value = window.scrollY > 40
}
```

`window.scrollY` — сколько пикселей проскроллено сверху. Порог 40px защищает от случайных микро-скроллов.

### Хуки жизненного цикла

```javascript
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
```

**Хуки** — функции, вызываемые на определённых этапах жизни компонента:
- `onMounted` — компонент смонтирован в DOM → добавляем слушатель
- `onUnmounted` — компонент удалён → убираем слушатель

**Почему важно убирать?** Иначе будет **утечка памяти** — слушатель продолжит работать впустую после ухода со страницы.

`{ passive: true }` — оптимизация: браузер не ждёт колбэк, сразу скроллит. Плавнее на мобильных.

---

## 🎨 Стили (Style scoped)

```css
.mobile-menu-enter-from { opacity: 0; transform: translateY(-12px); }
.mobile-menu-enter-active { transition: all 0.3s ease; }
.mobile-menu-enter-to { opacity: 1; transform: translateY(0); }
```

`scoped` — стили применяются только к этому компоненту (Vue добавляет уникальный атрибут `data-v-xxx` к элементам). Защищает от конфликтов с другими компонентами.

---

## 🔗 Связи с другими компонентами

```
App.vue
  │
  ├─ Header.vue ← шапка
  │     ├─ navLinks → ссылки на секции (#about, #services)
  │     └─ router-link to="/" → главная
  │
  ├─ <router-view /> ← здесь меняются страницы
  │
  ─ Footer.vue
```

Header независим: нет пропсов, нет emits. Использует только Vue Router.

---

## 🧠 Ключевые концепции

1. **Fixed positioning + scroll detection** — умная шапка, прозрачная в начале, стеклянная после скролла
2. **`v-for` с массивом** — данные отдельно, отображение отдельно
3. **Динамические классы `:class`** — условное применение CSS
4. **`<router-link>` вместо `<a>`** — переходы без перезагрузки в SPA
5. **`watch`** — автоматическая реакция на изменения
6. **Хуки жизненного цикла** — обязательная пара `addEventListener` ↔ `removeEventListener`
7. **`<Transition>`** — встроенные анимации появлений/исчезновений
8. **`scoped` стили** — изоляция CSS

---

##  Шпаргалка по директивам

| Директива | Назначение | Пример |
|-----------|------------|--------|
| `v-for` | Цикл по массиву | `v-for="link in navLinks"` |
| `:key` | Уникальный ID в цикле | `:key="link.path"` |
| `:class` | Динамический класс | `:class="isScrolled ? 'a' : 'b'"` |
| `:to` | Путь router-link | `:to="link.path"` |
| `v-if` | Условный рендер | `v-if="mobileMenuOpen"` |
| `v-else` | Альтернатива `v-if` | `v-else` |
| `@click` | Обработчик клика | `@click="toggle()"` |
| `{{ }}` | Интерполяция | `{{ link.name }}` |

---