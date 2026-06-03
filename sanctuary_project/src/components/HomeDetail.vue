<template>
  <section class="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-[#EFE6D7] !pt-32">
    <div class="max-w-6xl mx-auto">
      <div class="flex flex-col lg:flex-row gap-8 lg:gap-12">

        <!-- Левая колонка: Галерея изображений -->
        <div class="lg:w-1/2">
          <!-- Главное фото -->
          <div class="rounded-lg overflow-hidden mb-3 bg-[#D9D0C1]">
            <img
              :src="home.images[0]"
              :alt="home.name"
              class="w-full h-[300px] md:h-[400px] object-cover"
            />
          </div>

          <!-- Миниатюры -->
          <div class="grid grid-cols-3 gap-3">
            <div
              v-for="(image, index) in home.images.slice(1, 4)"
              :key="index"
              class="rounded-lg overflow-hidden bg-[#D9D0C1]"
            >
              <img
                :src="image"
                :alt="`${home.name} - фото ${index + 2}`"
                class="w-full h-[100px] md:h-[120px] object-cover"
              />
            </div>
          </div>
        </div>

        <!-- Правая колонка: Информация -->
        <div class="lg:w-1/2 flex flex-col">
          <!-- Название -->
          <h1 class="text-3xl md:text-4xl font-light font-['Tenor_Sans'] text-[#142C12] tracking-wide mb-4">
            {{ home.name }}
          </h1>

          <!-- Характеристики -->
          <div class="flex flex-wrap gap-4 md:gap-6 mb-6">
            <div class="font-['Montserrat'] text-[#142C12] text-sm md:text-base">
              <span class="font-medium">Вместимость:</span> {{ home.capacity }} человека
            </div>
            <div v-if="home.area" class="font-['Montserrat'] text-[#142C12] text-sm md:text-base">
              <span class="font-medium">Площадь:</span> {{ home.area }} м²
            </div>
          </div>

          <!-- Описание -->
          <div class="flex-1 mb-8">
            <p class="font-['Montserrat'] text-[#142C12] text-sm md:text-base leading-relaxed text-justify">
              {{ home.description }}
            </p>
          </div>

          <!-- Цена -->
          <div class="mt-auto">
            <div class="text-3xl md:text-4xl font-light font-['Tenor_Sans'] text-[#142C12]">
              {{ formatPrice(home.costs) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const homeId = ref(route.params.id);

// Моковые данные (пока API не подключен)
const home = ref({
  id: homeId.value,
  name: 'Стандартный номер',
  description: 'Стандартный номер в нашем санатории идеально подходит для комфортного проживания двух человек. В номере вас ждет уютная двуспальная кровать, где можно расслабиться после насыщенного дня. Для вашего удобства предоставлены телевизор и холодильник, а также санузел с необходимыми принадлежностями. Особое удовольствие доставит балкон с живописным видом на природу, где можно насладиться свежим воздухом и прекрасными пейзажами. Стоимость проживания в стандартном номере составляет 3500 рублей за сутки. Мы создаем все условия для вашего отдыха и восстановления сил!',
  images: [
    '/src/img/rooms/standart-main.jpg',
    '/src/img/rooms/standart-1.jpg',
    '/src/img/rooms/standart-2.jpg',
    '/src/img/rooms/standart-3.jpg',
  ],
  capacity: 2,
  area: 24,
  costs: 3500,
});

// Форматирование цены
const formatPrice = (price) => {
  return `${price} руб`;
};

// Загрузка данных при изменении ID
watch(() => route.params.id, (newId) => {
  homeId.value = newId;
  // Здесь будет запрос к API: await fetchHomeById(newId);
});
</script>
<style scoped>

</style>
