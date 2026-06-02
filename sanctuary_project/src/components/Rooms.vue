<template>
  <section class="bg-[#EFE6D7] py-18">
    <div class="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <!-- Заголовок -->
      <h1 class="text-4xl md:text-5xl font-light text-center font-['Tenor_Sans'] text-[#142C12] tracking-wide mb-8 md:mb-12">
        Номера/Домики
      </h1>

      <!-- Описание -->
      <p class="font-['Montserrat'] text-[#142C12] text-sm md:text-base leading-relaxed text-center mb-10 max-w-3xl">
        Санаторий "Чистый Воздух" предлагает разнообразное жилье: уютные стандартные номера,
        полулюксы и люксы для пар и семей, а также комфортабельные домики для уединенного отдыха.
        Семейные домики подходят для больших компаний, а эко-домики создают атмосферу близости к природе.
        Каждый номер оборудован всем необходимым для комфортного отдыха.
      </p>

      <!-- Слайдер -->
      <div class="relative w-full">
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
                :key="roomIndex"
                :title="room.title"
                :capacity="room.capacity"
                :description="room.description"
                :price="room.price"
                :imageUrl="room.imageUrl"
                @details-click="handleDetailsClick(room)"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import 'swiper/css/bundle';

import RoomCard from './RoomCard.vue';

const modules = [Pagination];
const groupSize = ref(3);

const getGroupSize = () => {
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 768) return 2;
  return 1;
};

const rooms = [
  {
    title: 'Стандартный номер',
    capacity: 'Вместимость: 2 человека',
    description: 'В номер входит: двуспальная кровать, телевизор, холодильник, санузел, балкон с видом на природу',
    price: '3500 руб',
    imageUrl: '/src/img/rooms/standart.jpg',
  },
  {
    title: 'Полулюкс',
    capacity: 'Вместимость: 3 человека',
    description: 'В номер входит: двуспальная кровать и раскладной диван, телевизор, мини-бар, санузел, балкон, кондиционер',
    price: '4500 руб',
    imageUrl: '/src/img/rooms/semi-lux.jpg',
  },
  {
    title: 'Люкс',
    capacity: 'Вместимость: 4 человека',
    description: 'В номер входит: две отдельные спальни, гостиная зона, телевизор, холодильник, санузел с ванной, балкон с панорамным видом',
    price: '6000 руб',
    imageUrl: '/src/img/rooms/lux.jpg',
  },
  {
    title: 'Стандартный номер',
    capacity: 'Вместимость: 2 человека',
    description: 'В номер входит: двуспальная кровать, телевизор, холодильник, санузел, балкон с видом на природу',
    price: '3500 руб',
    imageUrl: '/src/img/rooms/standart.jpg',
  },
  {
    title: 'Полулюкс',
    capacity: 'Вместимость: 3 человека',
    description: 'В номер входит: двуспальная кровать и раскладной диван, телевизор, мини-бар, санузел, балкон, кондиционер',
    price: '4500 руб',
    imageUrl: '/src/img/rooms/semi-lux.jpg',
  },
  {
    title: 'Люкс',
    capacity: 'Вместимость: 4 человека',
    description: 'В номер входит: две отдельные спальни, гостиная зона, телевизор, холодильник, санузел с ванной, балкон с панорамным видом',
    price: '6000 руб',
    imageUrl: '/src/img/rooms/lux.jpg',
  },
  {
    title: 'Эко-домик',
    capacity: 'Вместимость: 4 человека',
    description: 'В номер входит: две спальни, кухня с бытовой техникой, санузел, терраса, выполненный из экологически чистых материалов',
    price: '7500 руб',
    imageUrl: '/src/img/rooms/eco.jpg',
  },
  {
    title: 'Комфортабельный домик',
    capacity: 'Вместимость: 5 человек',
    description: 'В номер входит: три спальни, гостиная, кухня с необходимой утварью, санузел, балкон, кондиционер',
    price: '8500 руб',
    imageUrl: '/src/img/rooms/comfortable.png',
  },
  {
    title: 'Семейный домик',
    capacity: 'Вместимость: 4 человека',
    description: 'В номер входит: две спальни, кухня с необходимой утварью, санузел, терраса с зоной для отдыха',
    price: '7000 руб',
    imageUrl: '/src/img/rooms/family.png',
  },
];

const groupedRooms = computed(() => {
  const size = groupSize.value;
  const groups = [];
  for (let i = 0; i < rooms.length; i += size) {
    groups.push(rooms.slice(i, i + size));
  }
  return groups;
});

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

const handleDetailsClick = (room) => {
  console.log('Details clicked:', room.title);
};
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
