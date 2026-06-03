<template>
  <section class="bg-[#EFE6D7] py-18" id="rooms">
    <div class="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">

      <h1 class="text-4xl md:text-5xl font-light text-center font-['Tenor_Sans'] text-[#142C12] tracking-wide mb-8 md:mb-12">
        Номера/Домики
      </h1>
      <p class="font-['Montserrat'] text-[#142C12] text-sm md:text-base leading-relaxed text-center mb-10 max-w-3xl">
        Санаторий "Чистый Воздух" предлагает разнообразное жилье: уютные стандартные номера,
        полулюксы и люксы для пар и семей, а также комфортабельные домики для уединенного отдыха.
        Семейные домики подходят для больших компаний, а эко-домики создают атмосферу близости к природе.
        Каждый номер оборудован всем необходимым для комфортного отдыха.
      </p>
      <div v-if="loading" class="w-full flex justify-center items-center py-20">
        <p class="font-['Montserrat'] text-[#142C12] text-lg animate-pulse">
          Загрузка номеров...
        </p>
      </div>

      <div v-else-if="error" class="w-full flex flex-col items-center justify-center py-20">
        <p class="font-['Montserrat'] text-red-600 text-lg text-center mb-4">
          {{ error }}
        </p>
        <button
          @click="loadRooms"
          class="font-['Montserrat'] font-medium text-white px-6 py-2.5 rounded-md text-sm cursor-pointer transition-all hover:opacity-90 bg-[#777C5C]"
        >
          Попробовать снова
        </button>
      </div>

      <div v-else-if="rooms.length > 0" class="relative w-full">
        <Swiper
          :key="groupSize"
          :modules="modules"
          :space-between="24"
          :slides-per-view="1"
          :pagination="{ clickable: true }"
          :touch-ratio="1"
          :threshold="10"
          class="rooms-swiper pb-14"
        >
          <SwiperSlide v-for="(group, index) in groupedRooms" :key="index">
            <div class="flex flex-col gap-6 pb-3">
              <RoomCard
                v-for="(room, roomIndex) in group"
                :key="room.id"
                :title="room.name"
                :capacity="getCapacityText(room.capacity)"
                :description="room.short_description || getShortDescription(room.description)"
                :price="formatPrice(room.costs)"
                :imageUrl="room.images?.[0] || ''"
                @details-click="handleDetailsClick(room.id)"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <div v-else class="w-full text-center py-20">
        <p class="font-['Montserrat'] text-[#142C12] text-lg">
          Номера временно недоступны
        </p>
      </div>

    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import 'swiper/css/bundle';
import { getHomes } from '@/api/homes';

import RoomCard from './RoomCard.vue';

const router = useRouter();
const modules = [Pagination];
const groupSize = ref(3);

// Данные с API
const rooms = ref([]);
const loading = ref(false);
const error = ref(null);

// Функция загрузки номеров
const loadRooms = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await getHomes();
    // response.data.data — потому что Laravel оборачивает в data
    rooms.value = response.data.data || [];
  } catch (err) {
    error.value = 'Не удалось загрузить номера. Попробуйте позже.';
    console.error('Ошибка загрузки номеров:', err);
  } finally {
    loading.value = false;
  }
};

// Форматирование вместимости
const getCapacityText = (capacity) => {
  if (!capacity) return '';
  return `Вместимость: ${capacity} ${getGuestsWord(capacity)}`;
};

// Склонение слов "человек"
const getGuestsWord = (n) => {
  const lastTwo = n % 100;
  const lastOne = n % 10;

  if (lastTwo >= 11 && lastTwo <= 19) return 'человек';
  if (lastOne === 1) return 'человек';
  if (lastOne >= 2 && lastOne <= 4) return 'человека';
  return 'человек';
};

// Форматирование цены
const formatPrice = (price) => {
  const num = Number(price);
  if (isNaN(num)) return `${price} руб`;
  return `${num.toLocaleString('ru-RU')} руб`;
};

// Получаем короткое описание (если нет short_description)
const getShortDescription = (description) => {
  if (!description) return '';
  // Берем первые 100 символов
  return description.length > 100
    ? description.substring(0, 100) + '...'
    : description;
};

// Группировка номеров для слайдера
const groupedRooms = computed(() => {
  const size = groupSize.value;
  const groups = [];
  for (let i = 0; i < rooms.value.length; i += size) {
    groups.push(rooms.value.slice(i, i + size));
  }
  return groups;
});

// Обработка клика "Подробнее" — переход на страницу номера
const handleDetailsClick = (roomId) => {
  router.push({ name: 'HomeDetail', params: { id: roomId } });
};

// Определение размера группы в зависимости от ширины экрана
const getGroupSize = () => {
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 768) return 2;
  return 1;
};

// Обработчик изменения размера окна
const handleResize = () => {
  const newSize = getGroupSize();
  if (newSize !== groupSize.value) {
    groupSize.value = newSize;
  }
};

onMounted(() => {
  groupSize.value = getGroupSize();
  window.addEventListener('resize', handleResize);
  loadRooms(); // Загружаем данные при монтировании
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.rooms-swiper :deep(.swiper-wrapper) {
  align-items: stretch;
}

.rooms-swiper :deep(.swiper-slide) {
  height: auto !important;
}

:deep(.swiper-pagination-bullet) {
  background: #142C12;
  opacity: 0.3;
  width: 10px;
  height: 10px;
  transition: all 0.3s ease;
}

:deep(.swiper-pagination-bullet:hover) {
  opacity: 0.6;
}

:deep(.swiper-pagination-bullet-active) {
  background: #142C12;
  opacity: 1;
  width: 28px;
  border-radius: 5px;
}

.rooms-swiper :deep(.swiper-slide) {
  cursor: grab;
}

.rooms-swiper :deep(.swiper-slide:active) {
  cursor: grabbing;
}
</style>
